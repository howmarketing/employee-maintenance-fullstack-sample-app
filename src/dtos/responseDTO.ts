import { DepartmentDTO } from "@/dtos/departmentDTO";
import { EmployeeDTO } from "@/dtos/employeeDTO";

export interface BaseResponseDTO<T> {
	success: boolean;
	message: string;
	data: T;
}

export type EmployeeResponseDTO = BaseResponseDTO<EmployeeDTO>;

export interface EmployeesListResponseDTO extends BaseResponseDTO<EmployeeDTO[]> { }

export interface DepartmentResponseDTO extends BaseResponseDTO<DepartmentDTO> { }

export interface DepartmentsListResponseDTO extends BaseResponseDTO<DepartmentDTO[]> { }
