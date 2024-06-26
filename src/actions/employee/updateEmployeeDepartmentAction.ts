'use server';

import { UpdateEmployeeDepartmentRequest, UpdateEmployeeDepartmentResponse } from "@/app/api/update-employee-department/route";
import { revalidateTag } from "next/cache";

export default async function updateEmployeeDepartmentAction(
	_state: UpdateEmployeeDepartmentResponse,
	formData: FormData
): Promise<UpdateEmployeeDepartmentResponse> {

	const payload: UpdateEmployeeDepartmentRequest = {
		publicId: formData.get("publicId") as string,
		departmentKey: formData.get("departmentKey") as string
	}
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
	revalidateTag('get-employee-by-id')
	revalidateTag('get-all-departments')
	return response
}
