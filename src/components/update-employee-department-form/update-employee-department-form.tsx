'use client'

import updateEmployeeDepartmentAction from "@/actions/employee/updateEmployeeDepartmentAction";
import { GetAllDepartmentsResponse } from "@/app/api/get-all-departments/route";
import { UpdateEmployeeDepartmentResponse } from "@/app/api/update-employee-department/route";
import { revalidateTag } from "next/cache";
import { useActionState, useEffect, useState } from "react";


export const UpdateEmployeeDepartmentForm = ({ publicId, currentDepartmentKey }: { publicId: string; currentDepartmentKey: string; }) => {

	const [allDepartmentsResponse, setAllDepartmentsResponse] = useState<GetAllDepartmentsResponse>({
		success: false,
		message: "Loading departments...",
		data: []
	});
	const [departmentKey, setDepartmentKey] = useState<string>(currentDepartmentKey);
	const [updateEmployeeDepartmentResponse, dispatchUpdateEmployeeDepartmentAction, isPendingUpdateEmployeeDepartment] = useActionState(updateEmployeeDepartmentAction, {} as UpdateEmployeeDepartmentResponse)

	useEffect(() => {
		(async () => {
			const url = `${process?.env?.BASE_URL || "http://localhost:3000"}/api/get-all-departments`;
			const getAllDepartmentsResponse: GetAllDepartmentsResponse = await fetch(url, {
				next: { tags: ['get-all-departments'] }
			}).then(d => d.json());
			setAllDepartmentsResponse(getAllDepartmentsResponse)
		})()
	}, [])

	useEffect(() => {
		if(updateEmployeeDepartmentResponse?.data?.employee?.department?.key) {
			setDepartmentKey(updateEmployeeDepartmentResponse?.data?.employee?.department?.key)
		}
	}, [isPendingUpdateEmployeeDepartment, updateEmployeeDepartmentResponse])

	return (
		<>
			{!allDepartmentsResponse.success && (
				<div className="flex flex-col gap-2">
					<h1>{allDepartmentsResponse.message}</h1>
				</div>
			)}
			<form className="mt-2 col-span-12 flex flex-row justify-center items-center gap-2" action={dispatchUpdateEmployeeDepartmentAction} >
				<input type="hidden" name="publicId" value={publicId} />
				<select onChange={(e) => setDepartmentKey(e.target.value)} value={departmentKey} name="departmentKey" className="bg-gray-600 p-2 rounded-md text-white shadow-md">
					{allDepartmentsResponse.data.map((department, i) => (
						<option key={department.id} value={department.key}>{department.label}</option>
					))}
				</select>
				<button className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-gray-300" disabled={isPendingUpdateEmployeeDepartment}>
					{isPendingUpdateEmployeeDepartment ? 'Saving...' : 'Update'}
				</button>
				{!updateEmployeeDepartmentResponse.success && (
					<div className="flex flex-col gap-2">
						<h1>{updateEmployeeDepartmentResponse.message}</h1>
					</div>
				)}
			</form>

		</>
	)
}
