import { useReducer } from "react"

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @returns `forceUpdate` function
 *
 * @description This void state manager allows to trigger a re-render of a component.
 *
 * @example
 *
 * const forceUpdate = useForceUpdate()
 *
 * // later
 * forceUpdate()
 */

export default function useForceUpdate(): () => void {
	return useReducer(() => ({}), {})[1]
}
