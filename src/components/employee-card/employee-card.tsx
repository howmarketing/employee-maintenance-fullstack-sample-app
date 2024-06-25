import { GetEmployeeResponse } from "@/app/api/get-all-employees/route";
import { Card } from "@/components/card/card";
import Link from "next/link";

export const EmployeeCard = ({ employeeData }: Readonly<{ employeeData: GetEmployeeResponse['data'][number] }>) => {
	return (
		<Card>
			<div className="flex justify-center items-center col-span-2 bg-yellow-400">
				<h1 className="text-yellow-700 text-lg font-semibold">IMAGE</h1>
			</div>
			<div className="grid grid-cols-12 gap-2 flex-row flex-wrap justify-stretch items-stretch p-2 col-span-8 bg-white/10">
				<div className="col-span-12 flex gap-2 flex-row flex-wrap justify-start items-center bg-white/0 p-2 rounded-md">
					<h1 className="text-white text-lg">{employeeData.firstName} {employeeData.lastName}</h1>
					<small className="text-white"><i>({employeeData.department?.label || 'department'})</i></small>
				</div>
				<div className="col-span-12 flex flex-col flex-wrap justify-center items-start bg-white/0 p-2 rounded-md">
					<h2 className="text-white text-md">Hire Date</h2>
					<small className="text-white">{`${employeeData.hireDate?.toString() || 'N/AT0'}`.split('T').shift()}</small>
					<small className="text-white"><i>(2y, 6m, 21d)</i></small>
				</div>
			</div>
			<div className="col-span-2 bg-white/10 flex flex-row flex-wrap justify-center items-center">
				<div className="flex flex-col flex-wrap justify-center items-center">
					<Link href="href">
						<button className="bg-yellow-400 rounded-xl p-2">
							View details
						</button>
					</Link>
				</div>
			</div>

		</Card>
	);
}
