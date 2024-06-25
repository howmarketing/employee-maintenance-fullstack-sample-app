import { EmployeeCard } from "@/components/employee-card/employee-card";
import Image from "next/image";

export default function Home() {
  return (
	<div className="col-span-12 col-start-1 grid grid-cols-12 p-8">
		<EmployeeCard/>
	</div>
  );
}
