# Implement Repository Pattern and DTOs for Employee Management

## Overview
This PR introduces the repository pattern and Data Transfer Objects (DTOs) to our employee management system. These changes aim to improve code organization, maintainability, and separation of concerns.

## Tasks
- [x] Add EmployeeRepository class with createEmployee method
- [x] Create DTOs for Employee, Department, and API responses
- [x] Refactor API routes to use repository and DTOs
- [x] Update Prisma schema and migrations for employee and department models
- [x] Implement error handling and logging in API routes
- [x] Update seed data and seeding process
- [x] Adjust employee details page to display department history
- [x] Implement create department API route

## Key Changes

### 1. Employee Repository
- Implemented `EmployeeRepository` class with CRUD operations, particularly the `createEmployee` method.
- Centralized database operations related to employees.


```1:30:src/repositories/employeeRepository.ts
import { PrismaClient } from "@prisma/client";
import { CreateEmployeeDTO, EmployeeDTO } from '@/dtos/employeeDTO';

export class EmployeeRepository {
	constructor(private prisma: PrismaClient) { }

	async createEmployee(data: CreateEmployeeDTO): Promise<EmployeeDTO> {
		const createdEmployee = await this.prisma.employee.create({
			data,
			include: {
				department: true,
				EmployeeDepartmentHistory: true
			}
		});

		if (data.departmentKey) {
			await this.prisma.employeeDepartmentHistory.create({
				data: {
					employeeId: createdEmployee.id,
					departmentKey: data.departmentKey,
					departmentLabel: createdEmployee.department?.label || "",
				}
			});
		}

		return createdEmployee as EmployeeDTO;
	}

	// Add other CRUD methods here...
}
```


### 2. Data Transfer Objects (DTOs)
- Created DTOs for Employee, Department, and API responses.
- Improved type safety and data structure consistency across the application.


```1:22:src/dtos/employeeDTO.ts
import { CreateEmployeeSchema, UpdateEmployeeSchema } from "@/schemas/employeeSchema";
import { Department, Employee, EmployeeDepartmentHistory } from "@prisma/client";

export interface EmployeeDTO extends Employee {
	department: Department | null;
	EmployeeDepartmentHistory: EmployeeDepartmentHistory[];
}

export type CreateEmployeeDTO = CreateEmployeeSchema;


export type UpdateEmployeeDTO = UpdateEmployeeSchema;

export interface UpdateEmployeeActiveStatusDTO {
	publicId: string;
	isActive: boolean;
}

export interface UpdateEmployeeDepartmentDTO {
	publicId: string;
	departmentKey: string;
}
```


### 3. API Route Refactoring
- Updated API routes to utilize the new repository pattern and DTOs.
- Enhanced error handling and implemented logging in API routes.


```1:60:src/app/api/employee/route.ts
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
```


### 4. Database Schema Updates
- Modified Prisma schema for employee and department models.
- Created new migrations to reflect these changes.


```1:55:prisma/migrations/20240806200441_employee/migration.sql
-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "hire_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL,
    "department_key" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_department_history" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "department_key" TEXT NOT NULL,
    "department_label" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_department_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_key_key" ON "departments"("key");

-- CreateIndex
CREATE UNIQUE INDEX "employees_public_id_key" ON "employees"("public_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_key_fkey" FOREIGN KEY ("department_key") REFERENCES "departments"("key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_department_history" ADD CONSTRAINT "employee_department_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_department_history" ADD CONSTRAINT "employee_department_history_department_key_fkey" FOREIGN KEY ("department_key") REFERENCES "departments"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

```


### 5. Seeding Process
- Updated seed data and seeding process to align with new schema and DTOs.


```1:46:prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import departments from "./seed-data/departments.json";
import employees from "./seed-data/employees.json";
import employeeDepartmentHistory from "./seed-data/EmployeeDepartmentHistory.json";

const prisma = new PrismaClient({
	log: ["query"],
});

const batchSeed = async () => {
	await prisma.$transaction([
		prisma.department.createMany({ data: departments }),
		prisma.employee.createMany({ data: employees }),
		prisma.employeeDepartmentHistory.createMany({ data: employeeDepartmentHistory }),
	]);
}

const seedDepartments = async () => {
	console.log("Seeding departments...");
	const createDepartments = await Promise.all(departments.map(async (data) => {
		try {
			const department = await prisma.department.create({ data })
			return { success: true, msg: `department ${data.key}: ${data.label} created`, data: department };
		} catch (error) {
			console.log(error)
			return { success: false, msg: `error creating department ${data.key}: ${data.label}`, data };
		}
	}));
	console.log("Departments seeded");
	createDepartments.map(data => (console.log(data)));
};

const seedEmployees = async () => {
	console.log("Seeding employees...");
	const createEmployees = await Promise.all(employees.map(async (data) => {
		try {
			const employee = await prisma.employee.create({ data })
			return { success: true, msg: `employee ${employee.id}: ${data.firstName} ${data.lastName} created`, data: employee };
		} catch (error) {
			console.log(error)
			return { success: false, msg: `error creating employee ${data.publicId}: ${data.firstName} ${data.lastName}`, data };
		}
	}));
	console.log("Employees seeded");
	createEmployees.map(data => (console.log(data)));
};
```


### 6. Frontend Adjustments
- Modified the employee details page to display department history.


```94:124:src/app/employee-details/[publicId]/page.tsx
			<section id="employee-department-history" className="rounded-md gap-2 flex-row flex-wrap justify-center items-stretch grid grid-cols-10 col-span-12 p-2 bg-purple-500/0">
				<div className="col-span-12 grid grid-cols-12">
					<div className="col-span-12">
						<h2>Department History</h2>
					</div>
					<div className="col-span-6">
						<table className="border-collapse table-auto w-full text-sm border-b rounded-md border-slate-300 shadow-lg p-4">
							<thead className="p-4">
								<tr>
									<th className="border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left">#</th>
									<th className="border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left">Date</th>
									<th className="border-b dark:border-slate-600 font-medium text-slate-400 dark:text-slate-200 text-left">Department</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-slate-800">
								{getEmployeeById.data.employee?.EmployeeDepartmentHistory.reverse().map((historyItem, i) => (
									<tr className="p-2 even:bg-gray-100 odd:bg-white table-row" key={historyItem.id}>
										<td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-4 text-slate-500 dark:text-slate-400">
											{i + 1}
										</td>
										<td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-4 text-slate-500 dark:text-slate-400">
											{historyItem.createdAt?.toString() || " - "}
										</td>
										<td className="border-b border-slate-100 dark:border-slate-700 p-0 text-slate-500 dark:text-slate-400">
											{historyItem.departmentLabel}
										</td>
									</tr>
								))}
							</tbody>
						</table>
...
					</div>
```


### 7. New API Route
- Implemented create department API route.


```1:21:src/app/api/create-department/route.ts
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
```


## Benefits
- Improved code organization and maintainability
- Better separation of concerns
- Enhanced type safety with DTOs
- Centralized database operations in repositories
- Consistent error handling and logging across API routes

## Todo
- [ ] Write unit tests for the new `EmployeeRepository` class
- [ ] Update existing tests to use the new DTOs
- [ ] Create similar repositories for other entities (e.g., `DepartmentRepository`)
- [ ] Implement remaining CRUD operations in `EmployeeRepository`
- [ ] Update documentation to reflect the new architecture
- [ ] Perform thorough testing of all modified API routes
- [ ] Review and optimize database queries in the repository methods
- [ ] Consider implementing a caching layer for frequently accessed data

## Notes for Reviewers
- Pay special attention to the error handling in API routes
- Verify that all DTOs accurately represent our data structures
- Ensure that the new repository pattern doesn't introduce any performance bottlenecks
- Check if the seeding process correctly populates the database with the updated schema
