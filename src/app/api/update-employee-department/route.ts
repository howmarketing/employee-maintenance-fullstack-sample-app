import { Department, Employee, EmployeeDepartmentHistory, PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

type UpdateEmployeeRequiredFields = ['publicId', 'departmentKey'];

export type UpdateEmployeeDepartmentRequest = {
	publicId: string
	departmentKey: string
}

export type UpdateEmployeeDepartmentResponse = {
	success: boolean
	message: string
	data: {
		employee: Employee & {
			department: Department | null
			EmployeeDepartmentHistory: Array<EmployeeDepartmentHistory>
		};
	};
	body: UpdateEmployeeDepartmentRequest
}



export async function PATCH(request: Request) {
	const response: UpdateEmployeeDepartmentResponse = {
		success: false,
		message: "Missing required fields",
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
		body: {
			departmentKey: "",
			publicId: ""
		}
	}


	const body: UpdateEmployeeDepartmentRequest = await request.json();
	const requiredFields: UpdateEmployeeRequiredFields = ['publicId', 'departmentKey'];
	try {

		// check required fields
		const missingFields = requiredFields.filter(field => !(field in body));
		if (missingFields.length > 0) {
			response.success = false;
			response.message = `Missing required fields: ${missingFields.join(', ')}`;
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Bad Request",
			});
		}
		response.body = body;

		// check if employee exists
		const employee = await prisma.employee.findUnique({
			where: {
				publicId: body.publicId
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		});
		if (!employee) {
			response.success = false;
			response.message = `Employee not founded by the public id ${body.publicId}`;
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Not Found",
			});
		}
		response.data.employee = employee;

		// check if department exists
		const department = await prisma.department.findUnique({
			where: {
				key: body.departmentKey
			},
			include: {
				Employee: true,
				EmployeeDepartmentHistory: true
			}
		});
		if (!department) {
			response.success = false;
			response.message = `Department not founded by the key ${body.departmentKey}`;
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Not Found",
			});
		}

		if (department.key === employee.departmentKey) {
			response.success = false;
			response.message = `Employee already in ${department.label} department`;
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Bad Request",
			});
		}

		// update employee
		const updatedEmployee = await prisma.employee.update({
			where: {
				id: employee.id
			},
			data: {
				department: {
					connect: {
						key: body.departmentKey
					}
				}
			},
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		});
		if (!updatedEmployee) {
			response.success = false;
			response.message = `Employee not updated`;
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Not Found",
			});
		}

		response.data.employee = updatedEmployee;

		// create employee department history
		const employeeDepartmentHistory = await prisma.employeeDepartmentHistory.create({
			data: {
				employeeId: employee.id,
				departmentKey: department.key,
				departmentLabel: department.label,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});

		if (!employeeDepartmentHistory) {
			response.success = false;
			response.message = `Employee department history not created`;
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
				statusText: "Not Found",
			});
		}

		response.success = true;
		response.message = `Employee department updated`;

		response.data.employee.EmployeeDepartmentHistory.push(employeeDepartmentHistory);

	} catch (e) {
		response.success = false;
		response.message = `Error: ${e}`;
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
			statusText: "Internal Server Error",
		});
	}

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
		statusText: "OK",
	})
}
