import { useState, useEffect } from "react";
import "./App.css";
import { useForm } from "react-hook-form";

//If you plan on using types across your backend and frontend, you should
//use a 'lib' or 'package' folder at the root of your project.
//So you can import them in both your backend and frontend
//This is a good practice, and will make your life easier
// import { task, statusT } from "../lib/tasks";
enum statusT {
  pending,
  done,
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: statusT;
}

interface TaskProps {
  data: Task;
  onDelete: (id: number) => void;
}

//HACK: Seeing many errors as I opened this file, I'm guessing you've not
//properly installed the typescript plugin for your editor
//as well as prettier and eslint, fix this ASAP.
//I'll leave you with the errors I got that are obvious.
//Try to compile the website to see the errors -> npm build


function Task({ data, onDelete }: TaskProps) {
	//This should be const
  // let status: string = data.status == 0 ? "pending" : "done";
  const status: string = data.status == 0 ? "pending" : "done";
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.title}</td>
      <td>{data.description}</td>
      <td>{status}</td>
      <td>
        {" "}
        <button onClick={onDelete}> delete </button>{" "}
      </td>
    </tr>
  );
}

//You mistyped the Form props, it should be as follows
// function Form({ uploadTask }: { uploadTask: (data: Task) => void }) {
function Form({ uploadTask }: (data: Task) => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

	//You cannot declare a function without specifying its parameters type
  const onSubmit = (data) => {
    const FormTask: Task = {
      id: -1,
      title: data.title,
      description: data.description,
      status: data.status == "Pending" ? 0 : 1,
    };
    uploadTask(FormTask);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
			//You're mixing inline styles and css files. This is not a good practice.
			//Either you do inline styles with Tailwind (recommended), its modern css and 
			//pretty elegant. Either you define every css property in a css file and import it.
			//This is not mandatory but, mixing both makes you look amateur.
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "40px auto",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <label>Title</label>
        <br />
        <input
          {...register("title", { required: "Title is required" })}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            boxSizing: "border-box",
          }}
        />
        {errors.title && (
          <div style={{ color: "red", fontSize: "0.85em", marginTop: "4px" }}>
            {errors.title.message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Description</label>
        <br />
        <input
          {...register("description", { required: "Description is required" })}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            boxSizing: "border-box",
          }}
        />
        {errors.description && (
          <div style={{ color: "red", fontSize: "0.85em", marginTop: "4px" }}>
            {errors.description.message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Status</label>
        <br />
        <select
          {...register("status", { required: "Status is required" })}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        {errors.status && (
          <div style={{ color: "red", fontSize: "0.85em", marginTop: "4px" }}>
            {errors.status.message}
          </div>
        )}
      </div>

      <input
        type="submit"
        value="Submit"
	style={{
		width: "100%",
		padding: "8px",
		marginTop: "4px",
		boxSizing: "border-box",
	}}
      />
    </form>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const submitForm = (payload: Task) => {
    fetch("http://localhost:3000/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        payload.id = data.id;
				//This is not needed, you can just use the spread operator
        // const newTasks = tasks.slice(); // copy
        // newTasks.push(payload); // add
        // setTasks(newTasks);
				// Notice that react setState can take an optional callback
				// This alswo guarantees that the state is up to date when its modified
				// the manner you previously used can cause bugs in case of race conditions
				setTasks((prevTasks) => [...prevTasks, payload]);
      });
  };

  const removeTask = (id: number) => {
    fetch("http://localhost:3000/task/" + id, { method: "DELETE" })
      .then((response) => response.text())
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      });
  };

	//You shouldn't be fetching datas in a useEffect, its not a good practice
	//investigate in Tanstack Query, also called react-query.
	//For this dummy project, you can use the useEffect to fetch the tasks, its ok
  useEffect(() => {
    fetch("http://localhost:3000/tasks", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>description</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item) => (
            <Task
              key={item.id}
              data={item}
              onDelete={() => removeTask(item.id)}
            />
          ))}
        </tbody>
      </table>
      <Form uploadTask={submitForm} />
    </>
  );
}
//<Task data={taskt} onDelete={() => removeTask(taskt.id)} />
export default App;
