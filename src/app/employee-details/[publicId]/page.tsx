'use server';

import { GetEmployeeByIdResponse } from "@/app/api/get-employee-by-id/[publicId]/route";

export interface EmployeeDetailsProps { params: {publicId: string;} }

export default async function Page({params: {publicId}}:EmployeeDetailsProps){

	const url = `${process.env?.BASE_UEL || "http://localhost:3000"}/api/get-employee-by-id/${publicId}`;
	const getEmployeeById: GetEmployeeByIdResponse = await fetch(url, {
		next: { tags: ['get-employee-by-id'] }
	}).then( d => d.json());
	
	return (
		<div className="p-4 grid grid-cols-12 col-start-1 col-span-12">
			<div className="p-8 grid grid-cols-12 col-span-12 flex-row flex-wrap justify-center items-center">
				{!getEmployeeById.success && <h1>Error: {getEmployeeById.message}</h1>}
			</div>
			<section id="employee-data" className=" gap-2 flex-row flex-wrap justify-center items-stretch grid grid-cols-12 col-span-12 p-2 bg-purple-500">
				<div className="col-span-2 flex flex-row justify-center items-center bg-yellow-300" style={{minHeight: '160px'}}>
					<h1>IMAGE</h1>
				</div>
				<div className="grid grid-cols-12 col-span-6 fle-row flex-wrap justify-start items-center p-8 bg-gray-200">
					<h1>{publicId}</h1>
				</div>
			</section>
		</div>
	)
}
