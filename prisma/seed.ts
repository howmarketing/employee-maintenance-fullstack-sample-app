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


const seed = async () => {
	await seedDepartments();
	await seedEmployees();
};

async function main() {
	seed();
}

main()
