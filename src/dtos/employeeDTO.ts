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
