export const Card = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<div
			style={{ minHeight: '180px' }}
			className="shadow-lg m-4 p-2 rounded-xl grid grid-cols-12 col-span-12 col-start-1 bg-purple-900 justify-start items-stretch flex-wrap flex-row">
			{children}
		</div>
	)
}
