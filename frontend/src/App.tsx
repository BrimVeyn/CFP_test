import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useForm } from "react-hook-form";

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

let taskt: Task = {
  id: 0,
  title: "hello",
  description: "yes",
  status: 1,
};

function Task({ data, onDelete }: TaskProps) {
  let status: string = data.status == 0 ? "pending" : "done";
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

function Form({ uploadTask }: (data: Task) => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    let FormTask: Task = {
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
        const newTasks = tasks.slice(); // copy
        newTasks.push(payload); // add
        setTasks(newTasks);
      });
  };

  const removeTask = (id: number) => {
    fetch("http://localhost:3000/task/" + id, { method: "DELETE" })
      .then((response) => response.text())
      .then((data) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      });
  };

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
