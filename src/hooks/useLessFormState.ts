import { useEffect, useMemo, useReducer, useRef } from "react"
import type { ChangeEventHandler, Reducer } from "react"

/**
 * # Use less form state
 *
 * This small state management hook for inputs comes with a set of handlers and utility functions to significantly simplify management of form state.
 *
 * Every handler is tailored to a specific input type, achieving a high level of type safety, code readability,
 * and most importantly, thanks to utilizing the `name` property also **referential stability**.
 *
 *
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @link https://gist.github.com/ackvf/39049d109d2097c2b0c273190d0c391c#file-readme-md
 *
 * **Note:** You must provide `name` property on inputs.
 *
 * @params `(emptyState, initialState = emptyState, callbacks?)`
 * @returns `[state, onChangeHandlers, utilityFunctions, refState]`
 *
 * @param emptyState The state that is used when the form is cleared with `clearForm`.
 * @param initialState  aka *default values* - used to pre-populate input values on mount and when form is reset with `resetForm`.
 * @param callbacks Function callbacks that should be called on internal state changes and other events.
 *
 *
 * @example
 * const [formState, { onInputChange }, , refState] = useLessFormState<NFTFormState>(EMPTY_STATE, initialState)
 *
 * const handleSubmit = useCallback(() => {
 *   console.log(formState, refState.current) // formState is old state, refState.current is ALWAYS latest state.
 * }, []) // <- refState allows to avoid unnecessary callback updates
 *
 * @example // with more props and Form Validation
 * const [formErrors, { checkFieldErrorsOnFormStateChange }] = useLessFormErrors<CollectionFormState>(validationRules)
 *
 * const [formState, { onInputChange, onDropDownChange, onToggle }, { resetForm }] = useLessFormState<CollectionFormState>(
 *   emptyCollectionForm,
 *   initialFormState,
 *   { onChange: checkFieldErrorsOnFormStateChange }
 * )
 */

export function useLessFormState<S extends AnyObject = AnyObject>(
	emptyState: S = {} as S, initialState: Partial<S> = emptyState, callbacks?: Callbacks<S>
): [
		formState: S,
		onChangeHandlers: {
			/** Universal handler for any input. `name` property must be specified on the input. */
			onInputChange: ChangeEventHandler<HTMLInputElement>
			/** Universal handler for any `type=number` input. Value is converted to number. `name` property must be specified on the input. */
			onNumberInputChange: ChangeEventHandler<HTMLInputElement>
			/** Universal handler for any input. `name` property must be specified in the payload. */
			onValueChange: (eventTarget: TargetStub<S>) => void
			/** Handler tailored for `Dropdown` components. `name` property must be specified on the input. */
			onDropDownChange: (option: OptionWithName) => void
			/** Toggle handler that accepts an input Event. `name` property must be specified on the input. */
			onToggle: ChangeEventHandler<HTMLInputElement>
			/** Toggle handler that accepts Event.target stub. `name` property must be specified on the input. */
			onToggleValue: (eventTarget: Pick<TargetStub<S>, "name">) => void
			/** Universal handler that accepts Partial state objects. */
			onObjectChange: (partialState: Partial<S>) => void
		},
		utilityFunctions: {
			setField: {
				/** Sets one field with `Event.target`-like object.
				 * @example setField({name: 'url', value: 'https://qwerty.xyz/'}) */
				(eventTarget: TargetStub<S>): void
				/** Sets multiple fields with access to `prevState`.
				 * @example setField(() => ({creator: '', url: ''}) setField(() => initialState) setField(({count}) => ({count: count + 1})) */
				(updater: Updater<S>): void
			},
			/** Clears field value by setting it to its empty value. */
			clearField: (field: keyof S) => void,
			/** Resets field value to the `initialState` that was loaded from global Store or its `emptyState` value. */
			resetField: (field: keyof S) => void,
			/** Sets all fields to their empty values. */
			clearForm: () => void,
			/** Sets all fields to the `initialState` that was loaded from global Store or to their `emptyState` values. */
			resetForm: () => void,
		},
		refState: { current: S }
	] {

	const [state, setField] = useReducer<Reducer<S, TargetStub<S> | Updater<S>>>(
		(prevState, action) => {
			const pending = typeof action === "function" ? action(prevState) : { [action.name]: action.value }
			const newState = { ...prevState, ...pending }

			if (callbacks?.onChange) {
				const changedFields = Object.keys(pending)
				changedFields.forEach(field => callbacks?.onChange?.(newState, field))
			}

			return newState
		},
		{ ...emptyState, ...initialState }
	)

	const onChangeHandlers = useMemo(() => ({
		onInputChange({ target }: EventStub<S>) { setField(target) },
		onNumberInputChange({ target: { name, value } }: EventStub<S>) { setField({ name, value: Number(value) as any }) },
		onValueChange(target: TargetStub<S>) { setField(target) },
		onDropDownChange({ name, value: { value } }: OptionWithName<S[keyof S]>) { setField({ name, value }) },
		onToggle({ target: { name } }: EventStub) { setField(prevState => ({ [name]: !prevState[name] } as S)) },
		onToggleValue({ name }: TargetStub) { setField(prevState => ({ [name]: !prevState[name] } as S)) },
		onObjectChange(partialState: Partial<S>) { setField(() => partialState) },
	}), [])

	const utilityFunctions = useMemo(() => ({
		setField,
		// TODO: clearing/resetting form triggers "onChange" callback and potentially also error validation, which then gives errors for empty fields.
		// maybe add callback `onReset` to be used with useLessFormErrors.clearFormErrors()? OR add setField(partialFormState, {skipOnChange: true})?
		clearField(name: keyof S) { setField({ name, value: emptyState[name] }) },
		resetField(name: keyof S) { setField({ name, value: initialState[name] ?? emptyState[name] }) },
		clearForm() { setField(prevState => Object.fromEntries(Object.keys(prevState).map(name => [name, emptyState[name]])) as S) },
		resetForm() { setField(prevState => Object.fromEntries(Object.keys(prevState).map(name => [name, initialState[name]])) as S) },
	}), []) // eslint-disable-line react-hooks/exhaustive-deps

	const refState = useRef(state)
	refState.current = state

	useEffect(() => {
		callbacks?.onMount?.(refState.current)
		return () => callbacks?.onUnmount?.(refState.current)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// @ts-ignore Type 'ChangeEvent<HTMLInputElement>' is not assignable to type 'EventStub<S>'. The types of 'target.value' 'string' is not assignable to type 'S[keyof S]'.
	return [state, onChangeHandlers, utilityFunctions, refState]
}

// Types ---------------------------------------------------------------------------------------------------------------

interface Callbacks<S> {
	onChange?: (state: S, field: keyof S) => void
	onUnmount?: (state: S) => void
	// TODO instead of having to check errors on mount, the formState or formErrors should probably return something like "pristine/touched" prop.
	onMount?: (state: S) => void
}

type Updater<S = AnyObject> = (prevState: S) => Partial<S>

/** HTMLInput Event stub */
export interface EventStub<S = AnyObject> {
	target: TargetStub<S>
}

/** HTMLInput Event.target stub */
export interface TargetStub<S = AnyObject> {
	name: keyof S
	value: S[keyof S]
}

/** Dropdown Option */
export interface Option<T extends string = string> {
	title: string | React.ReactNode
	value: T
}

/** Dropdown Option as if it was an input event TargetStub */
export interface OptionWithName<T extends string = string> {
	name: string
	value: Option<T>
}
