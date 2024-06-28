'use server';
import { NextRequest } from "next/server";

import { PrismaClient, Department, Employee } from "@prisma/client";
const prisma = new PrismaClient();

export interface CreateEmployeeDAO extends Employee {
	department: Department | null
}

export type CreateEmployeeRequestDAO = Omit<Omit<Omit<Omit<Omit<CreateEmployeeDAO, 'department'>, 'updatedAt'>, 'createdAt'>, 'publicId'>, 'id'>;

export interface CreateEmployeeResponse {
	success: boolean;
	message: string;
	data: CreateEmployeeDAO;
}

export type UpdateEmployeeRequiredFields = (keyof CreateEmployeeRequestDAO)[]

export async function POST(request: NextRequest, context: any) {
	const response: CreateEmployeeResponse = { success: false, message: "", data: {} as CreateEmployeeDAO }
	const requiredFields: UpdateEmployeeRequiredFields = ["firstName", "lastName", "hireDate", "isActive", "departmentKey", "phone", "address"];
	
	const body:CreateEmployeeRequestDAO = await request.json()
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
		
		const createdEmployee = await prisma.employee.create({
			data: {
				firstName: body.firstName,
				lastName: body.lastName,
				hireDate: body.hireDate,
				isActive: body.isActive,
				departmentKey: body.departmentKey,
				phone: body.phone,
				address: body.address
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		})
       
		if (!createdEmployee) {
			response.message = "Something went wrong";
			return new Response(JSON.stringify(response), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Internal Server Error",
			});
		}

		if (body.departmentKey) {
			const employeeDepartmentHistory = await prisma.employeeDepartmentHistory.create({
				data: {
					employeeId: createdEmployee.id,
					departmentKey: body.departmentKey,
					departmentLabel: createdEmployee.department?.label || "",
				}
			})

			if (!employeeDepartmentHistory) {
				response.message = "Something went wrong";
				return new Response(JSON.stringify(response), {
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
					statusText: "Internal Server Error",
				});
			}
			createdEmployee.EmployeeDepartmentHistory.push(employeeDepartmentHistory);
		}

		response.success = true;
		response.message = "Success";
		response.data = createdEmployee;

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
