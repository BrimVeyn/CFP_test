import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

enum statusT {
  pending,
  done,
}

interface TaskProps {
  id: number;
  title: string;
  description: string;
  status: statusT;
  onDelete: (id: number) => void;
}

let taskt: TaskProps = {
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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

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
    </>
  );
}
//<Task data={taskt} onDelete={() => removeTask(taskt.id)} />
export default App;
