import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function Task() {
	return (
		<>
			<p> task </p>
			<p> state </p>
		</>
	);
}

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Task />
			<h1> Hello World </h1>
		</>
	);
}

export default App;
