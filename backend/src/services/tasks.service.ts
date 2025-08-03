// Wrong import statement, the only exported member is z furtunately, 
// but the import is still wrong
// import * as z from "zod";
import { z } from "zod";

let id_max = 0;

//This is a type, it is not a interface
//Types should be UpperCamelCase
//export type Task = 
export interface task {
	id: number;
	title: string;
	description: string;
	//You don't need this enum at all, in typescript you can do the following
	//status: "pending" | "done"; <-- the type in inferred
	status: statusT;
}


export enum statusT {
	pending,
	done,
}

export const taskSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	//NativeEnum is deprecated
	// status: z.nativeEnum(statusT),
	// Better way with the infered type shown above
	// status: z.enum(["pending", "done"]),
	status: z.enum(statusT)
});

export const idSchema = z.object({
	id: z.number(),
});

//Why would you use a map ? I guess you're not allowed to have a database,
//tho a map might not be the right data structure. Its not that important considering
//the project size tho.
export let tasks = new Map<number, task>();

//Obviously handling the id this way is very weird, but its a conseaquence
//of the fact that you miss a dabatase. Ids are generated autamatically
//as you might know.
export function addTask(t: task): number {
	t.id = id_max;
	tasks.set(t.id, t);
	// id_max++;
	return ++id_max;
}

//Typescript already provides a syntax to convert a map to an array
export function getTasks(): Array<task> {
	// let data: Array<task> = [];
	// tasks.forEach((key) => {
	// 	data.push(key);
	// });
	return Array.from(tasks.values());
}

//Same here, you can make better use of typescript
export function removeTask(id: number) {
	if (!tasks.has(id)) {
		throw new Error("Wrong id");
	}
	return tasks.get(id);
	// let t = tasks.get(id);
	// if (t) {
	// 	tasks.delete(id);
	// 	id_max--;
	// } else {
	// 	throw new Error("Wrong id");
	// }
}

