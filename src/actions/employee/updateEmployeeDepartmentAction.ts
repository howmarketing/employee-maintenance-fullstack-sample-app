'use server';

import { UpdateEmployeeDepartmentRequest, UpdateEmployeeDepartmentResponse } from "@/app/api/update-employee-department/route";

export default async function updateEmployeeDepartmentAction(
	_state: UpdateEmployeeDepartmentResponse,
	payload: UpdateEmployeeDepartmentRequest
  ): Promise<UpdateEmployeeDepartmentResponse> {

	// http://localhost:3000/api/update-employee-department
	const url = `${process.env?.BASE_URL || "http://localhost:3000"}/api/update-employee-department`;
	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
		.then(d => d.json());
	console.log(`updateEmployeeDepartmentAction: `, response);
	return response
}
