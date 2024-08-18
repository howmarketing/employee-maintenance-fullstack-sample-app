import { Department, Employee, EmployeeDepartmentHistory } from "@prisma/client";

export interface EmployeeDTO extends Employee {
	department: Department | null;
	EmployeeDepartmentHistory: EmployeeDepartmentHistory[];
}

export interface CreateEmployeeDTO {
	firstName: string;
	lastName: string;
	hireDate: string | null;
	isActive: boolean;
	departmentKey: string;
	phone: string;
	address: string;
}

export interface UpdateEmployeeDTO {
	publicId: string;
	firstName?: string;
	lastName?: string;
	hireDate?: string;
	isActive?: boolean;
	departmentKey?: string;
	phone?: string;
	address?: string;
}

export interface UpdateEmployeeActiveStatusDTO {
	publicId: string;
	isActive: boolean;
}

export interface UpdateEmployeeDepartmentDTO {
	publicId: string;
	departmentKey: string;
}
