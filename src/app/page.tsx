'use server';

import { EmployeeCard } from "@/components/employee-card/employee-card";
import { GetEmployeeResponse } from "./api/get-all-employees/route";

export default async function Home() {
	const url = `${process.env?.BASE_UEL || "http://localhost:3000"}/api/get-all-employees`;
	const getAllEmployeesResponse: GetEmployeeResponse = await fetch(url, {
		next: { tags: ['get-all-employees'] }
	}).then( d => d.json());

	return (
		<div className="col-span-12 col-start-1 grid grid-cols-12 p-8">
			{!getAllEmployeesResponse.success && <h1>Error: {getAllEmployeesResponse.message}</h1>}
			{getAllEmployeesResponse.success && getAllEmployeesResponse.data.map(employeeData => (
				<EmployeeCard employeeData={employeeData} key={employeeData.publicId} />
			))}
		</div>
	);
}
