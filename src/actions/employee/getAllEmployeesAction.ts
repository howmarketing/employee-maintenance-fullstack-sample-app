'use server'

import { Department, Employee } from "@prisma/client";

export interface IGetAllEmployessResponse extends Employee {
    department: Department
}
export async function getAllEmployeesAction(): Promise<Array<IGetAllEmployessResponse>> {
	// http://localhost:3000/api/get-all-employees
	const url = `${process.env?.BASE_URL || "http://localhost:3000"}/api/get-all-employees`;
	const employees = await fetch(url, {
		next: {tags: ['get-all-employees']}
	})
		.then(d => d.json());
	return employees
}

