'use server';
import { NextRequest } from "next/server";
// /get-employee-by-id/:id [REQUEST]

import { PrismaClient, Department, Employee, EmployeeDepartmentHistory } from "@prisma/client";
const prisma = new PrismaClient();

export interface GetEmployeeByIdResponse {
	success: boolean;
	message: string;
	data: {
		employee: Employee & {
			department: Department | null
			EmployeeDepartmentHistory: Array<EmployeeDepartmentHistory>
		};
	};
}

export async function GET(_request: NextRequest, context: Readonly<{params: {publicId: string}}>) {
	const response: GetEmployeeByIdResponse = { 
		success: false, 
		message: "", 
		data: {
			employee: {
				id: 0,
				publicId: "",
				firstName: "",
				lastName: "",
				phone: "",
				address: "",
				departmentKey: "",
				hireDate: new Date(),
				isActive: false,
				department: { id: 0, key: "", label: "", createdAt: new Date(), updatedAt: new Date() },
				EmployeeDepartmentHistory: [] as Array<EmployeeDepartmentHistory>,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		},
	}
	try {
        const { publicId } = context.params;
		const employee = await prisma.employee.findUnique({
			where: {
				publicId: publicId
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		})
        if (!employee) {
			response.message = "Employee not found";
            return new Response(JSON.stringify(response), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
                statusText: "Not Found",
            });
        }

		response.success = true;
		response.message = "Success";
		response.data.employee = employee;

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
            statusText: "OK",
        });
    } catch (e: any) { 
        response.message = e?.message || "Something went wrong";
		response.success = false;
        return new Response(JSON.stringify(response), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
            statusText: "Internal Server Error",
        });
    }
}
