import { useState } from "react";
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
}

let taskt: TaskProps = {
	id: 0,
	title: 'hello',
	description: 'yes',
	status: 1
}

function Task({ data }: TaskProps) {
	let status: string = data.status == 0 ? 'pending' : 'done';
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.title}</td>
      <td>{data.description}</td>
      <td>{ status }</td>
    </tr>
  );
}

function App() {
  const [tasks, setTasks] = useState(Array<Task>);

  return (
    <>
      <table>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>description</th>
          <th>status</th>
        </tr>
	<Task data={ taskt }/>
      </table>
    </>
  );
}

export default App;
