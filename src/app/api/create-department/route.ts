'use server';
import { NextRequest } from "next/server";
import { Prisma, PrismaClient, Department } from "@prisma/client";
import { z } from 'zod';

const prisma = new PrismaClient();

export interface CreateDepartmentDAO extends Department { }

export type CreateDepartmentRequestDAO = Omit<Omit<Omit<Omit<Omit<CreateDepartmentDAO, 'department'>, 'updatedAt'>, 'createdAt'>, 'publicId'>, 'id'>;

export interface CreateEmployeeResponse {
	success: boolean;
	status: string;
	statusCode: number;
	meta: { moduleName: string; target: string[] };
	message: string;
	data: CreateDepartmentDAO;
}

export type UpdateEmployeeRequiredFields = (keyof CreateDepartmentRequestDAO)[]

export async function POST(request: NextRequest, context: any) {

	const response: CreateEmployeeResponse = { status: "", statusCode: 400, meta: { moduleName: "create-department", target: [] }, success: false, message: "", data: {} as CreateDepartmentDAO }
	const schema = z.object({
		key: z.string().min(2),
		label: z.string().max(64),
	})

	// Parse request body
	const payload: CreateDepartmentRequestDAO = await request.json()
	const data = schema.parse(payload);

	// Check if department already exists
	const departmentExists = await prisma.department.findUnique({ where: { key: data.key } });
	if (departmentExists) {
		response.status = 'error';
		response.message = `Department with key ${data.key} already exists.`;
		response.meta = { moduleName: "Department", target: ["key"] };
		response.statusCode = 400;

		return new Response(JSON.stringify(response), {
			status: response.statusCode,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			statusText: response.status,
		});
	}

	// Create department
	try {
		const department = await prisma.department.create({ data });
		response.status = 'Created';
		response.message = `Department ${data.label} created successfully.`;
		response.meta = { moduleName: "Department", target: ["key"] };
		response.statusCode = 201;
		response.data = department;

		return new Response(JSON.stringify(response), {
			status: response.statusCode,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			statusText: response.status,
		});
	} catch (e: any) {
		let message = e?.message || 'Something went wrong. Could not create the department.';
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			message = `Something went wrong. Could not create the department`;
		}
		response.status			=	'Internal Server Error';
		response.message		=	message;
		response.meta			=	e?.meta || {};
		response.statusCode		=	500;
		return new Response(JSON.stringify(response), {
			status: response.statusCode,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			statusText: response.status,
		});
	}
}
