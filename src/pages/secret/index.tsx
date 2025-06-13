import { Block } from "@/components"
import * as icons from "@/components/Atoms/icons"

export default function Preview() {
	return (
		<main id="MainContentWrap" className="flex-grow">
			{
				Object.values(icons).map((Icon) => (
					<div key={Icon.name} className="flex items-center gap-2">
						<Icon className="h-6 w-6 text-stone-500" />
						<span>{Icon.name}</span>
					</div>
				))
			}

			<Block />
			<Block borderStyle="gradient">hello world</Block>
			<Block borderStyle="gradient" className='[--block-bg-border-color:theme("colors.orange.600")]' />
		</main>
	)
}
