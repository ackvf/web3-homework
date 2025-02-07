import { useRef, type CSSProperties } from "react"
import { twMerge } from "tailwind-merge"

export type BlockProps = {
	id?: string
	borderStyle?: "solid" | "gradient"
	className?: string
	onClick?: React.MouseEventHandler<HTMLDivElement>
}

/**
 * This Block component adds standard padding and rounded borders.
 */
export const Block: React.FC<React.PropsWithChildren<BlockProps>> = ({
	id = "Block",
	className: className_ = "",
	borderStyle = "solid",
	children,
	onClick,
}) => {
	const className = [classNames.base, "rounded-md", classNames.borderStyle[borderStyle]].join(" ")

	const interval = useRef<NodeJS.Timeout>()

	return (
		<div
			id={id}
			// prettier-ignore
			style={{
				"": "20deg",
				"--block-bg-content": "linear-gradient(var(--block-bg-color), var(--block-bg-color))", // this needs to be linear gradient, because flat color gets overlapped for some reason
				"--block-bg-border": `
					radial-gradient(
						650px circle at calc(50% + var(--block-bg-x, 0px)) calc(50% + var(--block-bg-y, 0px)),
						rgba(255, 255, 255, 1),
						var(--block-bg-border-color) 50%
					)
				`,
			} as CSSProperties}
			className={twMerge(className, className_)}
			onClick={onClick}
			tabIndex={onClick ? 0 : undefined}
			ref={el => {
				clearInterval(interval.current)
				if (el && borderStyle === "gradient") {
					let r = 90
					const { offsetWidth: width, offsetHeight: height } = el
					interval.current = setInterval(() => {
						const rad = (r++ * Math.PI) / 180
						const x = width / 2 * Math.cos(rad)
						const y = height / 2 * Math.sin(rad)
						el.style.setProperty("--block-bg-x", `${x}px`)
						el.style.setProperty("--block-bg-y", `${y}px`)
					}, 40)
				}
			}}
		>
			{children}
		</div>
	)
}

const classNames = {
	base: [
		"w-[600px] mx-auto",
		"p-6 md:p-8",
		"flex flex-col",
		"border border-stone-600 shadow-lg bg-stone-950",
		'[--block-bg-color:theme("colors.stone.950")]',
		'[--block-bg-border-color:theme("colors.stone.600")]',
	].join(" "),
	borderStyle: {
		solid: "",
		gradient: "!border-transparent [background:padding-box_var(--block-bg-content),border-box_var(--block-bg-border)]",
		// gradient: "!border-transparent [background:border-box_var(--block-bg-border)]", // visualize border effect
	},
	radius: {
		sm: "rounded-sm",
		md: "rounded-md",
	},
} as const
