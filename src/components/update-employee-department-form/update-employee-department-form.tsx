'use server'

import { GetAllDepartmentsResponse } from "@/app/api/get-all-departments/route";
import { FormButton } from "@/components/update-employee-department-form/form-button";
import { revalidateTag } from "next/cache";


export const UpdateEmployeeDepartmentForm = async ({ publicId, currentDepartmentKey }: {publicId: string; currentDepartmentKey: string; }) => {

	const url = `${process.env?.BASE_UEL || "http://localhost:3000"}/api/get-all-departments`;
	const getAllDepartments: GetAllDepartmentsResponse = await fetch(url, {
		next: { tags: ['get-all-departments'] }
	}).then(d => d.json());


	const handleSubmit = async (formData: FormData) => {
		'use server'
		const publicId = formData.get('publicId');
		const departmentKey = formData.get('departmentKey');
		if (!publicId || !departmentKey) {
			return;
		}
		const url = `${process.env?.BASE_UEL || "http://localhost:3000"}/api/update-employee-department`;
		const updateEmployeeDapartmentResponse = await fetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				publicId,
				departmentKey: departmentKey
			})
		}).then(d => d.json());
		revalidateTag('get-employee-by-id')
		// revalidateTag('get-all-departments')
		console.log('updateEmployeeDapartmentResponse: ', updateEmployeeDapartmentResponse);
	}

	return (
		<>
			{!getAllDepartments.success && (
				<div className="flex flex-col gap-2">
					<h1>Error: {getAllDepartments.message}</h1>
				</div>
			)}
			{getAllDepartments.success && (
				<form className="mt-2 col-span-12 flex flex-row justify-center items-center gap-2" action={handleSubmit}>
					<input type="hidden" name="publicId" value={publicId} />
					<select name="departmentKey" className="bg-gray-600 p-2 rounded-md text-white shadow-md">
						<option value="">Select Department</option>
						{getAllDepartments.data.map((department, i) => (
							<option selected={currentDepartmentKey === department.key} key={department.id} value={department.key}>{department.label}</option>
						))}
					</select>
					<FormButton />
				</form>
			)}
		</>
	)
}
