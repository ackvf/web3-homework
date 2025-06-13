import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const contextFallbackFunction: AnyFunction = () => {
	console.error("You cannot use this context without Provider!")
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
