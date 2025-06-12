export const colorCodes = {
	uncolorize: (str: string) => str.replace(/(\x1b|)\[[\d;]*m/gi, ""),

	reset: "0",
	bright: "1",
	dim: "2",
	underscore: "4",
	blink: "5",
	reverse: "7",
	hidden: "8",

	fg: {
		black: "30",
		red: "31",
		green: "32",
		yellow: "33",
		blue: "34",
		magenta: "35",
		cyan: "36",
		white: "37",
		crimson: "38",
	},

	bg: {
		black: "40",
		red: "41",
		green: "42",
		yellow: "43",
		blue: "44",
		magenta: "45",
		cyan: "46",
		white: "47",
		crimson: "48",
	},

	/** e.g. `wrap('0;30;41')` */
	wrap(...codeString: Args) { return `\x1b[${_(codeString)}m` },
} as const

/* Proxy implementation */

const trap = {
	get(target: ColorProxy, prop: keyof typeof colorCodes, receiver: typeof target) {

		if (target.hasOwnProperty(prop)) {
			let _code = target._code ?? "" as ColorProxy["_code"]
			let nextTarget: any = colorCodes[prop]
			let callable = {}

			if (!["bg", "fg"].includes(prop)) {
				nextTarget = colorCodes
				_code += (_code ? ";" : "") + target[prop]
				callable = function callableTemplateLiteralString(...message: Args): string {
					return colorCodes.wrap(_code!) + _(message) + (message.length ? colorCodes.wrap(colorCodes.reset) : "")
				}
			}

			const newTarget = Object.assign(callable, nextTarget, { _code })
			return new Proxy(newTarget, trap)
		}

		if (["toString", "valueOf", Symbol.toPrimitive].includes(prop))
			return () => colorCodes.wrap(target._code!)

		if (String.prototype[prop as any] !== undefined)
			return String.prototype[prop as any]

		// loop
		return receiver
	},
}

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @description Advanced colorizing library with proxy, tagged template literal support & customizations.
 *
 * note:
 * - `\x1b` = ``
 * - joining supported: `\x1b[0;30;41m`
 *
 * @example
 *
 * const red = colorProxy.fg.red
 * const dyeRed = colorProxy.fg.black.bg.red
 *
 * console.log(red`Hallo?`)
 * console.log(dyeRed('ERROR:'))
 *
 * logger.log(`${colors.fg.yellow}API server is listening on http://localhost:${red(port)+colors.fg.yellow}/api/v1/...${colors.reset}`)
 *
 * @example // All these are equivalent.
 *
 * console.log(colorProxy.fg.black.bg.red + 'Is this thing on?' + colors.reset + ' ...')
 * console.log(colorProxy.fg.black.bg.red('Is this thing on?') + ' ...')
 * console.log(colorProxy.fg.black.bg.red`Is this thing on?` + ' ...')
 *
 * @example
 * console.log('\x1b[32;41m green-red')
 * console.log('[32;41m green-red')
 * console.log(c.uncolorize('[32;41m default'))
 */

export const colorProxy = new Proxy<ColorProxy>(colorCodes as ColorProxy, trap)
export default colorProxy

/* Support for template literals */

export function interlace(strs: TemplateStringsArray | TemplateStringsArray["raw"], ...args: any[]): string {
	return strs.reduce((prev, current, ix) => prev + (current ?? "") + (args[ix] ?? ""), "")
}

export function interlaceRaw(strs: TemplateStringsArray, ...args: any[]): string {
	return interlace(strs.raw, ...args)
}

export const _ = extractMessage
export function extractMessage(args: Args): string {
	if (!["string", "number", "boolean"].includes(typeof args[0]) && !Array.isArray(args[0])) return ""
	if (isTemplate(args)) return interlace(...args)
	return `${args.join(" ") ?? ""}`
}

function isTemplate(args: Args): args is TemplateArgs { return !!(args as TemplateArgs)?.[0]?.raw }

/** Called as tagged template: `` red`no` `` */
export type TemplateArgs = [template: TemplateStringsArray, ...values: any[]]
/** Called as function: `` green('yes') `` */
export type MsgArgs = [message: string | number | boolean]
export type Args =
	| /** e.g. green('yes') */ MsgArgs
	| /** e.g. red`no` */ TemplateArgs

/* Support for Proxy */

export type ColorProxy =
	& typeof colorCodes
	& Controls
	& {
		fg: { [key in keyof typeof colorCodes.fg]: CallableTaggedTemplateProxy }
		bg: { [key in keyof typeof colorCodes.bg]: CallableTaggedTemplateProxy }
	}
	& { _code?: `${number}${`;${number}${`;${number}${string}` | ""}` | ""}` | "" }

type CallableTaggedTemplateProxy = string & ColorProxy & ((...args: Args) => string)

type ValueOf<T> = T[keyof T]
type ValidCodes = Extract<ValueOf<typeof colorCodes & (typeof colorCodes.bg | typeof colorCodes.fg)>, string>

type Controls = {
	[key in Exclude<keyof typeof colorCodes, "uncolorize" | "fg" | "bg" | "wrap">]: CallableTaggedTemplateProxy
}

// ---------------------------------------------------------------------------------------------------------------------

export const c = colorProxy

export const dyeRed = c.fg.black.bg.red
export const dyeGreen = c.fg.black.bg.green
export const dyeBlue = c.fg.black.bg.blue
export const dyeYellow = c.fg.black.bg.yellow

export const red = c.fg.red
export const green = c.fg.green
export const blue = c.fg.blue
export const yellow = c.fg.yellow
