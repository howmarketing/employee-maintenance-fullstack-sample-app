'use server';

import { GetEmployeeByIdResponse } from "@/app/api/get-employee-by-id/[publicId]/route";
import { UpdateEmployeeDepartmentForm } from "@/components/update-employee-department-form/update-employee-department-form";

export interface EmployeeDetailsProps { params: { publicId: string; } }

export default async function Page({ params: { publicId } }: EmployeeDetailsProps) {

	const url = `${process.env?.BASE_UEL || "http://localhost:3000"}/api/get-employee-by-id/${publicId}`;
	const getEmployeeById: GetEmployeeByIdResponse = await fetch(url, {
		next: { tags: ['get-employee-by-id'] }
	}).then(d => d.json());

	return (
		<div className="p-4 grid grid-cols-12 col-start-1 col-span-12">
			<div className="p-8 grid grid-cols-12 col-span-12 flex-row flex-wrap justify-center items-center">
				{!getEmployeeById.success && <h1>Error: {getEmployeeById.message}</h1>}
			</div>
			<section id="employee-data" className="rounded-md gap-2 flex-row flex-wrap justify-center items-stretch grid grid-cols-10 col-span-12 p-2 bg-purple-500/0">
				<div className="rounded-md shadow-sm col-span-2 p-4 flex flex-row justify-center items-center bg-cyan-300" style={{ minHeight: '160px' }}>
					<h1>IMAGE</h1>
				</div>
				<div className="grid grid-cols-12 col-span-6 fle-row flex-wrap justify-start items-center p-4 bg-white">
					<div className="flex col-span-12 flex-row flex-wrap justify-start items-center">
						<div className="flex flex-col gap-1 flex-wrap justify-start items-start">
							<h1 className="text-lg font-bold text-gray-700">
								{getEmployeeById.data.employee.firstName} {getEmployeeById.data.employee.lastName}
							</h1>
							<h1 className="text-md font-medium	 text-gray-600">
								Employee ID: {getEmployeeById.data?.employee?.id}
							</h1>
							<h1 className="text-md font-medium text-gray-600">
								Department: {getEmployeeById.data?.employee?.department?.label}
							</h1>
							<h1 className="text-md font-medium text-gray-600">
								Phone: {getEmployeeById.data?.employee?.phone}
							</h1>
							<h1 className="text-md font-medium text-gray-600">
								Address: {getEmployeeById.data?.employee?.address}
							</h1>
						</div>
					</div>
					<div className="flex col-span-12 flex-row flex-wrap justify-start items-center">
						<UpdateEmployeeDepartmentForm publicId={publicId} currentDepartmentKey={getEmployeeById.data?.employee?.department?.key || ""} />
					</div>
				</div>
				<div className="grid grid-cols-12 col-span-2 fle-row flex-wrap justify-center items-start p-4 bg-white">
					<div className="grid grid-cols-12 col-span-12 flex-row flex-wrap justify-start items-start bg-green-400/0">
						<div className="col-span-12 flex flex-col gap-1 flex-wrap justify-center items-center bg-orange-500/0">
							<h2 className="text-lg font-bold text-gray-700">Hire Date</h2>
							<span>{`${getEmployeeById?.data?.employee?.hireDate?.toString() || "N/AT00:00"}`.split('T').shift()}</span>
							<small>(2y 1m 4d)</small>
						</div>
						<div className="col-span-12 flex flex-col gap-1 flex-wrap justify-center items-center bg-pink-500/0">
							<button className={`py-2 px-4 m-2 rounded-md ${getEmployeeById.data?.employee?.isActive ? "bg-red-600 text-white" : "bg-green-400 text-green-950"}`}>{getEmployeeById.data?.employee?.isActive ? "Deactive" : "Active"}</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
