import { useMemo, useRef } from "react"

import type { EventStub, useLessFormState } from "./useLessFormState"
import useShallowState from "./useShallowState"

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @link https://gist.github.com/ackvf/39049d109d2097c2b0c273190d0c391c#file-readme-md
 */

// Regular expression validators and sets ------------------------------------------------------------------------------

const r = <R extends string>(regex: R): TypedRegExp<R> => new RegExp(regex)
const c = <C extends string>(chars: C): TypedRegExp<C> => new RegExp(`^[${chars}]*$`)

/* Note: Special characters must be double escaped! https://262.ecma-international.org/5.1/#sec-7.8.4 */

/* Character sets */
const TEXT = `a-zA-Z`
const ALNUM = `a-zA-Z0-9`
const NUMBER = `0-9`
const SPECIAL_CHARACTERS = `_.,:;~+-=*""^°\`<>(){}[\\\]!?$@&#%|\\\\/`
const SPECIAL_TEXTAREA_CHARACTERS = `${SPECIAL_CHARACTERS}\n\t•◦‣∙` as const

/* Regexes */
const DECIMAL_TEMPLATE = (decimals?: number) => `^\\d*(\\.\\d${(decimals === undefined) ? "*" as const : `{0,${decimals}}` as const})?$` as const
const ADDRESS = "^0x[a-fA-F0-9]{40}$"
const UUID = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
const URL = `^https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}(:[0-9]{1,5})?(/.*)?$`

// Validation rules & messages -----------------------------------------------------------------------------------------

/**
 * **Validator** functions - Each returns **true**: valid, **false**: invalid
 * - *Note*: Some of the functions might be **curried**, i.e. you need to call twice.
 *
 * Validator is executed inside `getFormErrors()` with two values: `validator(inputValue, formState)`
 */

export const check = {
	/** Makes a strict validator optional. */
	optional: <V extends string | number, FormState extends AnyObject, TypeHint>(validator: Validator<V, FormState, TypeHint>): Validator<V, FormState, TypeHint> => ((v, s) => minLength(1)(v, s) ? validator(v, s) : true),

	/** Compare that two fields are equal. */
	matchesField: <FormState>(fieldName: keyof FormState) => (value: string, formState: FormState): boolean => value === formState[fieldName],

	/* booleans */

	isTrue: (value => value == true) as Validator<boolean>,

	/* numbers  *  (note: all inputs are strings!) */

	min: (min: number) => (value: Numberish) => Number(value) >= min,
	max: (max: number) => (value: Numberish) => Number(value) <= max,
	clamp: (min: number, max: number) => (value: Numberish) => Number(value) >= min && Number(value) <= max,

	/* strings  *  (btw: all inputs are strings, so these can be used with all inputs) */

	maxLength: (length: number): Validator<string | number> => s => s?.toString().length <= length,
	minLength: minLength = (length: number): Validator<string | number> => s => s?.toString().length >= length,
	notEmpty: minLength(1),
	isTrimmed: (s: string) => s.trim() === s,

	/* regex */

	/** Matches a provided regex. */
	isMatching: isMatching = r => s => r.test(s),
	isText: isMatching(c(TEXT)),
	isAlphaNumeric: isMatching(c(ALNUM)),
	isNumeric: isMatching(c(NUMBER)),
	isDecimal: (maxDecimals?: number) => isMatching(r(DECIMAL_TEMPLATE(maxDecimals))),
	isURL: isMatching(r(URL)),
	isAddress: isMatching(r(ADDRESS)),
	isUUID: isMatching(r(UUID)),
	/** Same as `isAlphaNumeric` but additionally allows spaces.*/
	isAlphaNumericText: isMatching(c(ALNUM)),
	/** AlphaNumeric text containing spaces and special characters. */
	isRelaxedText: isMatching(c(`${ALNUM} ${SPECIAL_CHARACTERS}`)),
} as const

/**
 * Common validation pair tuples - `[Validator, message]`
 */

export const validations = {
	/** Makes a strict validation pair tuple optional. */
	optional: <V extends string | number, FormState extends AnyObject, TypeHint>([validator, message]: ValidatorMessagePair<V, FormState, TypeHint>): ValidatorMessagePair<V, FormState, TypeHint> => [(value, formState) => check.optional(validator)(value, formState), message],

	/** Check minimum length == 1. */ // TODO: Improve this rule for other data types? (Are there other data types for inputs anyway?)
	required: [check.notEmpty, "Required."],
	checked: [check.isTrue, "Required."],
	onlyText: [check.isText, "Only english letters are allowed."],
	onlyAlphaNumeric: [check.isAlphaNumeric, "Only alphanumeric characters allowed."],
	onlyNumeric: [check.isNumeric, "Only numbers allowed."],
	onlyDecimal: (maxDecimals?: number) => [check.isDecimal(maxDecimals), `Only numbers with ${maxDecimals === undefined ? "" : `${maxDecimals} ` as const}decimal places allowed.`] as const,
	onlyAddress: [check.isAddress, "Must be a wallet address."],
	onlyURL: [check.isURL, "Must be a valid http / https url."],
	/** Same as `onlyAlphaNumeric` but additionally allows spaces.*/
	onlyAlphaNumericText: [check.isAlphaNumericText, "Only alphanumeric characters allowed."],
	/** Text containing spaces, special characters and emoji. */
	minLength: <T extends number>(minLength: T) => [check.minLength(minLength), `Too few characters, you need at least ${minLength} characters.`] as const,
	maxLength: <T extends number>(maxLength: T) => [check.maxLength(maxLength), `Too many characters, limit to ${maxLength} characters.`] as const,
	noWrappingWhitespace: [check.isTrimmed, "Remove leading and trailing whitespace characters."],
	matchesField: <FormState extends AnyObject>(fieldName: keyof FormState, message?: string): ValidatorMessagePair<any, FormState> => [check.matchesField(fieldName), message ?? `Value doesn"t match "${fieldName as string}" field`],
} as const

// "reference before declaration" hack, can"t use `check.isMatching()` within another check.
var isMatching: <Regex extends TypedRegExp, TypeHint = Regex extends TypedRegExp<infer S> ? S : string>(regex: Regex) => Validator<string, any, TypeHint>
var minLength: (length: number) => Validator<string | number>

// ---------------------------------------------------------------------------------------------------------------------
// Hook implementation -------------------------------------------------------------------------------------------------

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @link https://gist.github.com/ackvf/39049d109d2097c2b0c273190d0c391c#file-readme-md
 *
 * **Note:** You must provide `name` property on inputs.
 *
 * @params `(rules)`
 * @returns `[formErrors, errorChecks, utilityFunctions]`
 *
 * @param initialRules Object with validation rules matching `FormState` keys.
 *
 * @see {@link useLessFormState} for more advanced use case.
 *
 * @example
 * // This is a simplified example without integration with `useLessFormState()` hook.
 * // See 👉`useLessFormState.ts` for more advanced use case.
 *
 * // It"s really intuitive and easy to use:
 *
 * const [, {getFormErrors}] = useLessFormErrors<FormState>()
 *
 * const formErrors = getFormErrors(
 *   // formState //
 *   {
 *     name: "yolo",
 *     confirmName: "nope",
 *   },
 *   // validation rules to apply to each field name //
 *   {
 *     name: [
 *       // Manual rule definition consists of a validator function and a message.
 *       [v => v.length >= 5, "Name is too short"],
 *       [v => v.includes("green"), "Name is not green"],
 *     ],
 *     confirmName: [
 *       // There are plenty of pre-made rules
 *       [check.minLength(5), "Name is too short"],
 *       // and even full reusable validation objects!
 *       validations.required,
 *
 *       // Make a strict rule optional.
 *       validations.optional(validations.minLength(5)),
 *
 *       // Access the full formState too. (These are all equivalent.)
 *       [(value, formState) => formState.name === value, "Names are not same."],
 *       [check.matchesField("name"), "Names are not same."], // Using pre-made Validator and a custom message.
 *       validations.matchesField("name"), // Using pre-made Validation that composes Validator and optional message.
 *     ],
 *   }
 * )
 */

export function useLessFormErrors<FormState extends AnyObject>(
	initialRules: RuleSet<FormState> = {}
): [
		formErrors: FormErrors<FormState>,
		errorChecks: {
			/* *checks* operate on internal formErrors state and mutate it - eventually triggering input errors. */

			/** Performs check for errors on **currently changed field**. To be used with `useLessFormState` `onChange` callback. E.g. `useLessFormState(...,{ onChange: checkFieldErrorsOnFormStateChange })`. */
			checkFieldErrorsOnFormStateChange: (state: Partial<FormState>, changedField: keyof FormState) => void
			/** Performs check for errors on **one field**. Can be used directly on input callbacks such as `onBlur`, `onChange`, etc. */
			checkFieldErrors: (event: EventStub) => void,
			/** Performs check for errors on **all or specified form fields**. Accepts adhoc rules definition. */
			checkFormErrors: (formState: Partial<FormState>, changedFields?: Array<keyof FormState>, replaceRules?: RuleSet<Partial<FormState>>) => void,

			/* *gets* return the result to the caller without storing it - meaning nothing will get passed to inputs as errors. */

			/** Same as `checkFormErrors()` but doesn"t save result in state. */
			getFormErrors: (formState: Partial<FormState>, replaceRules?: RuleSet<Partial<FormState>>) => FormErrors<Partial<FormState>>,
			/** Gets errors using `getFormErrors(formState)` and counts them using `countErrors(errors)`. Does not mutate state. */
			getFormErrorsCount: (formState: Partial<FormState>, replaceRules?: RuleSet<Partial<FormState>>) => number,
		},
		utilityFunctions: {
			setFormErrors: typeof setFormErrors,
			clearFormErrors: () => void,
			clearFieldErrors: (field: keyof FormState) => void,
			/** Get first error from input field that has multiple validation errors. */
			getFirstError: (errors?: string | string[]) => string | undefined,
			/** Get all input validation errors joined into a single string. */
			getAllErrors: (errors?: string | string[]) => string | undefined,
			/** Counts **existing** errors in a provided `FormErrors` object, unlike `getFormErrorsCount(formState)` which checks the whole formState and then counts the found errors. */
			countErrors: typeof utilityFunctions.countErrors,
			// TODO `replaceRules(rules: RuleSet<FormState>)` to replace rules definition on runtime.
		},
		refErrors: { current: FormErrors<FormState> }
	] {

	const [formErrors, setFormErrors, { clearState: clearFormErrors, clearProperty: clearFieldErrors }] = useShallowState<FormErrors<FormState>>({})

	const errorChecks = useMemo(() => ({
		checkFieldErrorsOnFormStateChange: (formState: Partial<FormState>, name: keyof FormState) =>
			setFormErrors(getFormErrors(formState, initialRules as AnyObject, [name])),
		checkFieldErrors: ({ target: { name, value } }: EventStub) =>
			setFormErrors(getFormErrors({ [name]: value }, initialRules as AnyObject, [name])), // TODO find better type?
		checkFormErrors: (formState: Partial<FormState>, changedFields?: Array<keyof FormState>, rules: RuleSet<FormState> = initialRules) =>
			setFormErrors(getFormErrors(formState, rules as AnyObject, changedFields)),
		getFormErrors: (formState: Partial<FormState>, rules = initialRules) =>
			getFormErrors(formState, rules as AnyObject),
		getFormErrorsCount: (formState: Partial<FormState>, rules = initialRules) =>
			utilityFunctions.countErrors(getFormErrors(formState, rules as AnyObject)),
	}), []) // eslint-disable-line react-hooks/exhaustive-deps

	const utilityFunctions = useMemo(() => ({
		setFormErrors,
		clearFormErrors,
		clearFieldErrors,
		getFirstError: (errors?: string | string[]) => Array.isArray(errors) ? errors[0] : errors,
		getAllErrors: (errors?: string | string[]) => Array.isArray(errors) ? errors.join(", ").replace("., ", ", ") : errors,
		countErrors: (formErrors: FormErrors<FormState> = refErrors.current) => Object.values(formErrors).flat().filter(ndef => ndef).length,
	}), []) // eslint-disable-line react-hooks/exhaustive-deps

	const refErrors = useRef(formErrors)
	refErrors.current = formErrors

	return [formErrors, errorChecks, utilityFunctions, refErrors]
}

// Validation core -----------------------------------------------------------------------------------------------------

function getFormErrors<FormState extends AnyObject, ChangedFields extends Array<keyof FormState>>(
	formState: FormState,
	rules: RuleSet<FormState>,
	changedFields: ChangedFields = Object.keys(rules) as ChangedFields
): FormErrors<Pick<FormState, typeof changedFields[number]>> {

	const errors: FormErrors<FormState> = {}

	changedFields.forEach((field) => {
		const value = formState[field]
		const validatorMessagePairs: Array<ValidatorMessagePair<FormState[keyof FormState], FormState>> | undefined = rules[field]
		if (validatorMessagePairs === undefined) return

		const fieldErrors = validatorMessagePairs
			.map(([validator, message]) => validator(value, formState) || message || "Invalid value.")
			.filter(valid => valid !== true) as string[]

		errors[field] = fieldErrors.length ? fieldErrors : undefined

	})

	return errors
}

// Types ---------------------------------------------------------------------------------------------------------------

/** Returns **true** for valid, **false** for invalid */
type Validator<Value = any, State extends AnyObject = AnyObject, TypeHint = Value> = (value: Value, formState: State) => boolean
type ValidatorMessagePair<Value = any, State extends AnyObject = AnyObject, TypeHint = Value> = [validator: Validator<Value, State, TypeHint>, message: string] | readonly [validator: Validator<Value, State, TypeHint>, message: string]

export type RuleSet<FormState extends AnyObject/*= AnyObject*/> = { [key in keyof FormState]?: Array<ValidatorMessagePair<FormState[key], FormState>> }
type FormErrors<FormState extends AnyObject = AnyObject> = { [key in keyof FormState]?: string | string[] }

interface TypedRegExp<TypeHint = ""> extends RegExp { }
