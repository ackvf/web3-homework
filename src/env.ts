/* env parsers */

function parseBoolean(envValue?: string, defaultValue = false) {
	return envValue !== undefined ? Boolean(JSON.parse(envValue)) : defaultValue
}

/* ENV */

export const IS_DEV = parseBoolean(process.env.NEXT_PUBLIC_IS_DEV, false)

/*  */
