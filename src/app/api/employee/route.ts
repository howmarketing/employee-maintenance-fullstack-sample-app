'use server';
import { NextRequest } from "next/server";
import { PrismaClient, Department, Employee } from "@prisma/client";
import { z } from 'zod';
import { EmployeeRepository } from '@/repositories/employeeRepository';
import { CreateEmployeeDTO } from '@/dtos/employeeDTO';

const prisma = new PrismaClient();
const employeeRepository = new EmployeeRepository(prisma);

export interface CreateEmployeeDAO extends Employee {
	department: Department | null
}

export type CreateEmployeeRequestDAO = Omit<Omit<Omit<Omit<Omit<CreateEmployeeDAO, 'department'>, 'updatedAt'>, 'createdAt'>, 'publicId'>, 'id'>;

export interface CreateEmployeeResponse {
	success: boolean;
	message: string;
	data: CreateEmployeeDAO;
}

// Define a reusable function for creating error responses
const createErrorResponse = (message: string, status: number, statusText: string) => {
	return new Response(JSON.stringify({ success: false, message, data: {} }), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		statusText,
	});
};

export async function POST(request: NextRequest) {
	try {
		const body: CreateEmployeeRequestDAO = await request.json();

		const createSchema = z.object({
			firstName: z.string().min(1),
			lastName: z.string().min(1),
			hireDate: z.string().nullable(),
			isActive: z.boolean(),
			departmentKey: z.string().min(1),
			phone: z.string().min(1),
			address: z.string().max(64)
		});

		const validatedData = createSchema.parse(body);

		const createdEmployee = await prisma.employee.create({
			data: validatedData,
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		});

		if (validatedData.departmentKey) {
			await prisma.employeeDepartmentHistory.create({
				data: {
					employeeId: createdEmployee.id,
					departmentKey: validatedData.departmentKey,
					departmentLabel: createdEmployee.department?.label || "",
				}
			});
		}

		return new Response(JSON.stringify({
			success: true,
			message: "Success",
			data: createdEmployee
		}), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			statusText: "CREATED",
		});
	} catch (e: any) {
		if (e instanceof z.ZodError) {
			return createErrorResponse(e.errors.map(err => `${err.path}: ${err.message}`).join(', '), 400, "Bad Request");
		}
		return createErrorResponse(e?.message || "Something went wrong", 500, "Internal Server Error");
	}
}
