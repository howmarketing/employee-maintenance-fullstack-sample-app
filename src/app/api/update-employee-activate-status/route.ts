'use server';
import { NextRequest } from "next/server";

import { PrismaClient, Department, Employee } from "@prisma/client";
const prisma = new PrismaClient();

export interface UpdateEmployeeDAO extends Employee {
	department: Department | null
}

export interface UpdateEmployeeResponse {
	success: boolean;
	message: string;
	data: UpdateEmployeeDAO;
}

export type UpdateEmployeeRequiredFields = (keyof Omit<UpdateEmployeeDAO, 'id'>)[]

export async function PATCH(request: NextRequest, context: any) {
	const response: UpdateEmployeeResponse = { success: false, message: "", data: {} as UpdateEmployeeDAO }
	const requiredFields: UpdateEmployeeRequiredFields = ['publicId', 'isActive'];
	
	const body = await request.json()
	const missingFields = requiredFields.filter((field) => !(field in body))
	
	if (missingFields.length > 0 ) {
		response.message = `Missing required fields: ${missingFields.join(', ')}`;
		return new Response(JSON.stringify(response), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
			statusText: "Bad Request",
		});
	}
	
	try {
		const employee = await prisma.employee.findUnique({
			where: {
				publicId: body.publicId
			}
		});
		if (!employee) {
			response.message = `Employee not founded by the public id ${body.publicId}`;
            return new Response(JSON.stringify(response), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
                statusText: "Not Found",
            });
        }
		const updatedEmployee = await prisma.employee.update({
			where: {
				publicId: body.publicId
			},
			data: {
				isActive: body.isActive
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		})
       

		response.success = true;
		response.message = "Success";
		response.data = updatedEmployee;

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
