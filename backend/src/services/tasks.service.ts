import * as z from "zod";

let id_max = 0;

export interface task {
	id: number;
	title: string;
	description: string;
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
	status: z.nativeEnum(statusT),
});

export const idSchema = z.object({
	id: z.number(),
});

export let tasks = new Map<number, task>();

export function addTask(t: task): number {
	t.id = id_max;
	tasks.set(t.id, t);
	id_max++;
	return 1;
}

export function getTasks(): Array<task> {
	let data: Array<task> = [];
	tasks.forEach((key, value) => {
		data.push(key);
	});
	return data;
}

export function removeTask(id: number) {
	let t = tasks.get(id);
	if (t) {
		tasks.delete(id);
		id_max--;
	} else {
		throw new Error("Wrong id");
	}
}

const taskt: task = {
	id: 0,
	title: 'titre',
	description: ' this is a description',
	status: 0,
}

tasks.set(0, taskt);
