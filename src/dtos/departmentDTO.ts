import { Department } from "@prisma/client";

export interface DepartmentDTO extends Department { }

export interface CreateDepartmentDTO {
	key: string;
	label: string;
}
