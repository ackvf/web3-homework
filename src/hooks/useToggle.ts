import { useCallback, useReducer, useRef } from 'react'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @param initialState - `true` | *default:* `false` | `null`
 * @returns `[state, toggle, turnOn, turnOff, turn, refState]`
 *
 * @description This state manager toggles between `true` and `false` automatically,
 * but it can also force a value when provided.
 *
 * @example // 1. Initialize the state
 *
 * const [state, toggle, turnOn, turnOff, turn, refState] = useToggle()  // initial state set to Off - `false`
 * const [...] = useToggle(false)   // initial state set to Off (default)
 * const [...] = useToggle(true)    // initial state set to On
 * const [...] = useToggle(null)    // not On, not Off - useful in some cases
 *
 * @example // 2. Use the actions
 *
 * toggle() // toggles state to On  - `true`
 * toggle() // toggles state to Off - `false`
 *
 * turnOn()  // alias for turn(true)
 * turnOff() // alias for turn(false)
 *
 * turn(true) // turns On - `true`
 * turn(true) // keeps On
 *
 * turn(false) // turns Off - `false`
 *
 * @example // Special case: `null` state
 *
 * useToggle<null | boolean>(false) // you can explicitly specify `<null | boolean>`, otherwise boolean is inferred
 * useToggle(null) // `<null | boolean>` type is inferred automatically
 * turn(null) // null state - not On, not Off
 */

export function useToggle<
  Initial extends boolean | null = boolean,
  S = Initial extends null ? boolean | null : boolean
>(
  initialState: Initial = false as Initial
): [
    state: S,
    toggle: () => void,
    turnOn: () => void,
    turnOff: () => void,
    turn: (turnTo: S) => void,
    refState: { current: S }
  ] {
  const [state, change] = useReducer((state_: S, turnTo?: S) => turnTo ?? !state_, initialState as any) as [S, (turnTo?: S) => void]

  const refState = useRef(state)
  refState.current = state

  const toggle = useCallback(() => change(), [])
  const turn = useCallback((turnTo: S) => change(turnTo), [])
  const turnOn = useCallback(() => change(true as S), [])
  const turnOff = useCallback(() => change(false as S), [])

  /** All functions and refState are **referentially stable**. */
  return [state, toggle, turnOn, turnOff, turn, refState]
}
