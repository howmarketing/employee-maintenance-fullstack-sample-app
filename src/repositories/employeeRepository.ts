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
