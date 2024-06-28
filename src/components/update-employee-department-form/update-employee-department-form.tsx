'use client'

import updateEmployeeDepartmentAction from "@/actions/employee/updateEmployeeDepartmentAction";
import { GetAllDepartmentsResponse } from "@/app/api/get-all-departments/route";
import { UpdateEmployeeDepartmentResponse } from "@/app/api/update-employee-department/route";
import { revalidateTag } from "next/cache";
import { useActionState, useEffect, useRef, useState } from "react";


export const UpdateEmployeeDepartmentForm = ({ publicId, currentDepartmentKey }: { publicId: string; currentDepartmentKey: string; }) => {

	const [allDepartmentsResponse, setAllDepartmentsResponse] = useState<GetAllDepartmentsResponse>({
		success: null,
		message: "Loading departments...",
		data: []
	} as unknown as GetAllDepartmentsResponse);
	const [departmentKey, setDepartmentKey] = useState<string>("");
	const [departmentLabel, setDepartmentLabel] = useState<string>("");
	const debug = false;
	const [updateEmployeeDepartmentResponse, dispatchUpdateEmployeeDepartmentAction, isPendingUpdateEmployeeDepartment] = useActionState(updateEmployeeDepartmentAction, {} as UpdateEmployeeDepartmentResponse)
	const [updateDepartmentModalIsOpen, setUpdateDepartmentModalIsOpen] = useState<boolean>(updateEmployeeDepartmentResponse.success === false);

	useEffect(() => {
		setDepartmentKey(currentDepartmentKey);
		(async () => {
			const url = `${process?.env?.BASE_URL || "http://localhost:3000"}/api/get-all-departments`;
			const getAllDepartmentsResponse: GetAllDepartmentsResponse = await fetch(url, {
				next: { tags: ['get-all-departments'] }
			}).then(d => d.json());
			setAllDepartmentsResponse(getAllDepartmentsResponse)
		})()
	}, [])
	useEffect(() => {
		allDepartmentsResponse.data.map(department => {
			if (department.key === departmentKey) {
				setDepartmentLabel(department.label);
			}
		})
	}, [allDepartmentsResponse, departmentKey])

	useEffect(() => {
		let t = setTimeout(() => {}, 100);
		const updateEmployeeDepartmentErrorStatus = updateEmployeeDepartmentResponse.success === false;
		if (updateEmployeeDepartmentErrorStatus && !isPendingUpdateEmployeeDepartment) {
			setUpdateDepartmentModalIsOpen(updateEmployeeDepartmentErrorStatus)
			console.log({updateEmployeeDepartmentErrorStatus, updateEmployeeDepartmentResponse});
			clearTimeout(t);
			t = setTimeout(() => {
				setUpdateDepartmentModalIsOpen(false)
			}, 12000)
		}
		if (updateEmployeeDepartmentResponse?.data?.employee?.department?.key) {
			setDepartmentKey(departmentKey)
		}
		return (() => {
			clearTimeout(t);
		})
	}, [isPendingUpdateEmployeeDepartment, updateEmployeeDepartmentResponse])

	return (
		<>
			<div className="mt-2 col-span-12 grid grid-cols-12 flex-row justify-center items-center gap-2">
				{(allDepartmentsResponse.success === false) && (
					<code className="flex-col gap-2 col-span-12 grid grid-cols-12">
						<pre className="col-span-12 text-red-500 font-semibold flex flex-row flex-wrap text-wrap justify-start items-start">
							{allDepartmentsResponse.message}
						</pre>
					</code>
				)}
				{(null === allDepartmentsResponse.success) && (
					<div className="flex-col gap-2 col-span-12 grid grid-cols-12">
						<h1 className="col-span-12 text-purple-500 font-semibold flex flex-row flex-wrap text-wrap">
							{allDepartmentsResponse.message}
						</h1>
					</div>
				)}
				{debug && (
					<div className="flex-col gap-2 col-span-12 grid grid-cols-12">
						<h1 className="col-span-12">{departmentKey}: {departmentLabel}</h1>
					</div>
				)}
				{!(null === allDepartmentsResponse.success) && (
					<form className="mt-2 col-span-12 grid grid-cols-12 flex-row justify-center items-center gap-2" action={dispatchUpdateEmployeeDepartmentAction} >
						<div className="flex-row flex-wrap gap-2 col-span-12 flex">
							<input type="hidden" name="publicId" value={publicId} />
							<select title="Select an department to update the employee department" onChange={(e) => { setDepartmentKey(e.target.value) }} value={departmentKey} name="departmentKey" className="bg-gray-600 p-2 rounded-md text-white shadow-md">
								<option value={(updateEmployeeDepartmentResponse?.data?.employee?.departmentKey || currentDepartmentKey)}>{departmentLabel}</option>
								{allDepartmentsResponse.data.map((department, i) => {
									if ((updateEmployeeDepartmentResponse?.data?.employee?.departmentKey || currentDepartmentKey) === department.key) {
										return null
									}
									return (
										<option key={department.id} value={department.key}>{department.label}</option>
									)
								})}
							</select>
							<button className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-gray-300" disabled={isPendingUpdateEmployeeDepartment || (updateEmployeeDepartmentResponse?.data?.employee?.departmentKey || currentDepartmentKey) === departmentKey} type="submit">
								{isPendingUpdateEmployeeDepartment ? 'Saving...' : 'Update'}
							</button>
						</div>
					</form>
				)}
				{updateDepartmentModalIsOpen && (
					<code className="flex flex-row justify-center items-center bg-white rounded-md border-2 border-red-800 shadow-2xl gap-2 col-span-12 " style={{ position: "fixed", top: "calc(50% - 175px)", left: "calc(50% - 250px)", width: "500px", height: "350px", overflow: "visible", zIndex: 1000 }}>
						<button onClick={() => setUpdateDepartmentModalIsOpen(false)} className="font-bold text-white bg-black/90 rounded-full p-0 flex flex-row flex-wrap justify-center items-center shadow-md" style={{width: "24px", height: "24px", position:"absolute", right: "-14px", top: "-12px"}}>X</button>
						<pre style={{maxHeight: "100%", maxWidth: "100%", overflow: "auto"}} className="text-sm bg-black/0 rounded-md col-span-12 text-red-500 font-semibold flex flex-row flex-wrap text-wrap justify-start items-start">
							{updateEmployeeDepartmentResponse.message}
						</pre>
					</code>
				)}
			</div>
		</>
	)
}
