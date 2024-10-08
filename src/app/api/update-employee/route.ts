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

export async function PUT(request: NextRequest, context: any) {
	const response: UpdateEmployeeResponse = { success: false, message: "", data: {} as UpdateEmployeeDAO }
	const requiredFields: UpdateEmployeeRequiredFields = ['publicId', 'firstName','lastName','address','hireDate','isActive','phone','departmentKey'];
	
	const body: UpdateEmployeeDAO = await request.json()
	body.hireDate = new Date(body.hireDate as unknown as string);
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
				firstName: body.firstName,
				lastName: body.lastName,
				address: body.address,
				hireDate: body.hireDate,
				isActive: body.isActive,
				phone: body.phone,
				departmentKey: body.departmentKey
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		})
       if (!updatedEmployee) {
			response.message = "Something went wrong";
			return new Response(JSON.stringify(response), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Internal Server Error",
			});
		}
		if (null !== body.departmentKey && (employee.departmentKey!== body.departmentKey)) {
			const employeeDepartmentHistory = await prisma.employeeDepartmentHistory.create({
				data: {
					employeeId: updatedEmployee.id,
					departmentKey: body.departmentKey,
					departmentLabel: updatedEmployee.department?.label || "",
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
			updatedEmployee.EmployeeDepartmentHistory.push(employeeDepartmentHistory);
		}

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
