'use server';

import { GetEmployeeByIdResponse } from "@/app/api/get-employee-by-id/[publicId]/route";
import { UpdateEmployeeResponse } from "@/app/api/update-employee-activate-status/route";
import { UpdateEmployeeDepartmentForm } from "@/components/update-employee-department-form/update-employee-department-form";
import { revalidateTag } from "next/cache";
import { useEffect } from "react";

export interface EmployeeDetailsProps { params: { publicId: string; } }

export default async function Page({ params: { publicId } }: EmployeeDetailsProps) {

	const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
	
	const url = `${BASE_URL}/api/get-employee-by-id/${publicId}`;
	
	const getEmployeeById: GetEmployeeByIdResponse = await fetch(url, {
		next: { tags: ['get-employee-by-id'] }
	}).then(d => d.json());

	const updateEmployeeActiveStatus = async (formData: FormData) => {
		'use server';
		const isActive = formData.get('isActive')
		const payload = {
			publicId: formData.get('publicId'),
			isActive: isActive === 'true' ? true : false
		}
		const _updateEmployeeActiveStatus: UpdateEmployeeResponse = await fetch(`${BASE_URL}/api/update-employee-activate-status`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		}).then(d => d.json());
		revalidateTag('get-employee-by-id')
	}

	useEffect(() => {
		console.log('BASE_URL: ', BASE_URL);
	}, []);
	
	useEffect(() => {
		console.log('BASE_URL: ', BASE_URL);
		console.log('Employee data: ', getEmployeeById)
	}, [getEmployeeById, BASE_URL])

	return (
		<div className="p-4 grid grid-cols-12 col-start-1 col-span-12">
			<div className="p-8 grid grid-cols-12 col-span-12 flex-row flex-wrap justify-center items-center">
				{!getEmployeeById.success && <h1 id="Error">Error: {getEmployeeById.message}</h1>}
			</div>
			<section id="employee-data" className="rounded-md gap-2 flex-row flex-wrap justify-center items-stretch grid grid-cols-10 col-span-12 p-2 bg-purple-500/0">
				<div className="rounded-md shadow-sm col-span-2 p-4 flex flex-row justify-center items-end bg-cyan-300" style={{ minHeight: '160px' }}>
					{!getEmployeeById.data.employee.isActive && <button className="w-full flex text-sm font-bold bg-red-500 justify-center items-center text-white rounded-md p-2">Inactive</button>}
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
							<form action={updateEmployeeActiveStatus}>
								<input type="hidden" name="publicId" value={publicId} />
								<input type="hidden" name="isActive" value={getEmployeeById.data?.employee?.isActive ? "false" : "true"} />
								<button type="submit" className={`py-2 px-4 m-2 rounded-md ${getEmployeeById.data?.employee?.isActive ? "bg-red-600 text-white" : "bg-green-400 text-green-950"}`}>{getEmployeeById.data?.employee?.isActive ? "Deactive" : "Active"}</button>
							</form>
						</div>
					</div>
				</div>
			</section>
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
					</div>
				</div>
			</section>
		</div>
	)
}
