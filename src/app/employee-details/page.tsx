'use server';


export default async function Page(){
	return (
		<div className="p-4 grid grid-cols-12 col-start-1 col-span-12">
			<section id="employee-data" className=" gap-2 flex-row flex-wrap justify-center items-stretch grid grid-cols-12 col-span-12 p-2 bg-purple-500">
				<div className="col-span-2 flex flex-row justify-center items-center bg-yellow-300" style={{minHeight: '160px'}}>
					<h1>IMAGE</h1>
				</div>
				<div className="grid grid-cols-12 col-span-6 fle-row flex-wrap justify-start items-center p-8 bg-gray-200">
					<h1>descriptions</h1>
				</div>
			</section>
		</div>
	)
}
