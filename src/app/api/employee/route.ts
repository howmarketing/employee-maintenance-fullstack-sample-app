import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { EmployeeRepository } from '@/repositories/employeeRepository';
import { CreateEmployeeDTO } from '@/dtos/employeeDTO';
import { EmployeeResponseDTO } from '@/dtos/responseDTO';
import { createEmployeeSchema } from '@/schemas/employeeSchema';
import { logger } from '@/utils/logger';

export const dynamic = "force-dynamic";

// Singleton pattern for PrismaClient to avoid multiple instances
const prisma = new PrismaClient();
const employeeRepository = new EmployeeRepository(prisma);

export type ICreateResponseProperties = EmployeeResponseDTO & { status: number, statusText: string };

const createResponse = ({
	success = false,
	message = "",
	data = {} as EmployeeResponseDTO["data"],
	status = 200,
	statusText = "OK"
}: ICreateResponseProperties): Response => {
	const responseObject: EmployeeResponseDTO = { success, message, data };
	return new Response(JSON.stringify(responseObject), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*", // Consider restricting this for security
		},
		statusText,
	});
};

export async function POST(request: NextRequest) {
	try {
		const body: CreateEmployeeDTO = await request.json();
		const validatedData = createEmployeeSchema.parse(body);
		const createdEmployee = await employeeRepository.createEmployee(validatedData);
		logger.info(`Employee created: ${createdEmployee.id}`);
		return createResponse({ success: true, message: "Success", data: createdEmployee, status: 201, statusText: "CREATED" });
	} catch (e: any) {
		const errorResponse = {
			success: false,
			message: e?.message || "Something went wrong",
			status: 500,
			statusText: "Internal Server Error",
		} as ICreateResponseProperties;
		if (e instanceof z.ZodError) {
			errorResponse.message = e.errors.map(err => `${err.path}: ${err.message}`).join(', ');
			errorResponse.status = 400;
			errorResponse.statusText = "Bad Request";
			logger.error(`Error creating employee: ${errorResponse.message}`);
			return createResponse(errorResponse);
		}
		logger.error(`Error creating employee: ${errorResponse.message}`);
		return createResponse(errorResponse);
	}
}
