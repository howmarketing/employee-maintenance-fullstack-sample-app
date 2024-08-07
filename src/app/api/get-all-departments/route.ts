import { Department, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export type GetAllDepartmentsResponse = {
	success: boolean
	message: string
	data: Array<Department>
}

export async function GET(_request: NextRequest, _context: any) {

	const response: GetAllDepartmentsResponse = {
		success: false,
		message: "",
		data: []
	}
	try {
		const departments: Array<Department> = await prisma.department.findMany({
			where: {
				id: {
					gte: 0
				}
			},
			orderBy: {
				id: "desc"
			}
		});

		// check departments
		if (!departments.length) {
			response.success	= false,
			response.message	= "No departments found",
			response.data		= []
			
			return new Response(JSON.stringify(response), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				statusText: "Not Found",
			})
		}

		response.success	= 	true,
		response.message	= 	"Departments found",
		response.data		= 	departments

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (e: any) {
		response.message = e?.message || "Something went wrong"
		response.data = []
		response.success = false

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			statusText: "Internal Server Error",
		})
	}

}
