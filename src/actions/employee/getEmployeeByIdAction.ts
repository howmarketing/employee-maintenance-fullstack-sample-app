'use server'
import { GetEmployeeByIdResponse } from "@/app/api/get-employee-by-id/[publicId]/route";


export async function getEmployeeByIdAction(_current: any, publicId: string): Promise<GetEmployeeByIdResponse> {
	// http://localhost:3000/api/get-employee-by-id/b5e7470e-2554-47f8-a111-37f0dbf1fe1d
	const url = `${process.env?.BASE_URL || "http://localhost:3000"}/api/get-employee-by-id/${publicId}`
	const employeeById: GetEmployeeByIdResponse = await fetch(url, {
		next: { tags: ['get-employee-by-id'] }
	})
		.then(d => d.json());
	return employeeById;
}
