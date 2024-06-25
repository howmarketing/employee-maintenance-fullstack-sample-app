'use server';
import { NextRequest } from "next/server";
// [GET] /get-employee-all-employees/

import { PrismaClient, Department, Employee, EmployeeDepartmentHistory } from "@prisma/client";
const prisma = new PrismaClient();

export interface IEmployee extends Employee {
		department: Department | null
		EmployeeDepartmentHistory: Array<EmployeeDepartmentHistory>
}

export interface GetEmployeeResponse {
	success: boolean;
	message: string;
	data: Array<IEmployee>
}

export async function GET(_request: NextRequest) {
	const response: GetEmployeeResponse = { 
		success: false, 
		message: "", 
		data: [],
	}
	try {

		const employees = await prisma.employee.findMany({
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		});
        if (!employees.length) {
			response.success 	= false;
			response.data 		= [];
			response.message 	= "No employees found";
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Not Found",
			})
		}
		response.success 	= true;
		response.message 	= "Success";
		response.data 		= employees;
		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
			statusText: "OK",
		})
    } catch (e: any) { 
        response.message 	= e?.message || "Something went wrong";
		response.data 		= [];
		response.success 	= false;
        return new Response(JSON.stringify(response), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
            statusText: "Internal Server Error",
        });
    }
}
