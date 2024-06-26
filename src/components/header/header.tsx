import Link from "next/link"

export const Header = () => {
	return (
		<div className="bg-cyan-900 grid grid-cols-12 flex-row flex-wrap justify-start items-start py-4 w-full">
			<div className="gap-2 grid grid-cols-12 col-span-10 col-start-2 bg-white/10 rounded-lg p-4 overflow-hidden">
				<div className="rounded-xl col-span-2 col-start-1 bg-purple-900 justify-center items-center align-middle flex flex-wrap flex-col">
					<h1 className="text-white justify-center items-center flex flex-row flex-wrap text-md font-semibold">
						<Link className="text-white" href={"/"} legacyBehavior={true}>Gabriel Ariza</Link>
					</h1>
				</div>
				<div className="col-span-10 col-start-3 bg-white/30 rounded-lg p-4">
					<ul className="flex flex-row flex-wrap gap-4 w-full justify-start items-start align-middle">
						<li className="text-white bg-black/20 rounded-md p-2 underline"><Link className="text-white" href={"/"} legacyBehavior={true}>Home</Link></li>
					</ul>
				</div>
			</div>
		</div>
	)
}
