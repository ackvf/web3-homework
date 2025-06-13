import { useMemo, useReducer, useRef } from "react"

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @link https://gist.github.com/ackvf/39049d109d2097c2b0c273190d0c391c#file-readme-md
 *
 * @params `(initialState)`
 * @returns `[state, setState, utilityFunctions, refState]`
 *
 * @description This state manager allows to store multiple keys just like
 * the old `this.setState()` from React Class Components.
 *
 * Any state updates are **shallowly merged** with the old state object,
 * replacing any old properties and keeping those that did not change.
 *
 * It also comes preloaded with few **utility functions** and a convenient
 * **stable reference** to an always-up-to-date state `refState` that can be used
 * inside `useCallback` or `useMemo` without triggering dependency changes.
 *
 * @example
 * const [state, setState] = useShallowState({ a: 1, b: 1 }) // initial state
 *
 * setState((oldState) => ({ b: oldSate.b + 1 }))
 * setState({ c: 3 })
 * // state is now {a: 1, b: 2, c: 3}
 */

export default function useShallowState<S extends AnyObject = AnyObject>(
	initialState: S = {} as S,
): [
		state: S,
		setState: SetState<S>,
		utilityFunctions: {
			/** Sets all properties to `undefined`. */
			clearState: () => void
			/** Clears property value by setting it to `undefined`. */
			clearProperty: (property: keyof S) => void
			/** Resets all properties to their `initialState` values. */
			resetState: () => void
			/** Resets property to its `initialState` value. */
			resetProperty: (property: keyof S) => void
			/** Deletes all properties from the state object. */
			deleteState: () => void
			/** Deletes a property from the state object. */
			deleteProperty: (property: keyof S) => void
		},
		/** Escape hatch to make life easier inside hooks and callbacks ¯\_(ツ)_/¯ */
		refState: { readonly current: S }
	] {

	const [state, setState] = useReducer(
		(prevState, action = {}) => ({ ...prevState, ...(typeof action === "function" ? action(prevState) : action) }),
		initialState,
	) as [S, SetState<S>]

	const refState = useRef<S>(state)
	refState.current = state

	const utilityFunctions = useMemo(() => ({
		clearState() { setState(prevState => Object.fromEntries(Object.keys(prevState).map(key => [key, undefined])) as { [key in keyof S]?: undefined }) },
		clearProperty(property: keyof S) { setState({ [property]: undefined } as Partial<S>) },
		resetState() { setState(prevState => Object.fromEntries(Object.keys(prevState).map(key => [key, initialState[key as keyof S]])) as typeof initialState) },
		resetProperty(property: keyof S) { setState({ [property]: initialState[property] } as Partial<S>) },
		deleteState() { setState(prevState => void Object.keys(prevState).forEach(key => delete prevState[key])) },
		deleteProperty(property: keyof S) { setState(prevState => void delete prevState[property]) },
	}), []) // eslint-disable-line react-hooks/exhaustive-deps

	return [state, setState, utilityFunctions, refState]
}

export type SetState<S> = (actionOrState?: Partial<S> | ((prevState: S) => Partial<S> | void)) => void
