////// -----------------------------------------------------------------------------------------------------------------
/*//// -----------------------------------------------------------------------------------------------------------------

This file is an "Ambient declarations file". The types defined here are available globally.
More info here: https://stackoverflow.com/a/73389225/985454

Don't use `import` and `export` in this file directly! It breaks ambience.
To import external types in an ambient declarations file (this file) use the following:

*//**
* @example
* declare type React = import('react')
*//*

To contribute ambient declarations from any file, even non-ambient ones, use this:

*//**
* @example
* declare global {
*   interface Window {
*     ethereum: any
*   }
* }
*//*

/*//// -----------------------------------------------------------------------------------------------------------------
////// -----------------------------------------------------------------------------------------------------------------

type AnyObject<T = any> = Record<string, T>
type Numberish = number | `${number}`

type Modify<T, R extends PartialAny<T>> = Omit<T, keyof R> & R

type PartialAny<T> = {
	[P in keyof T]?: any
}

/**
 * Provides better intellisense for JSX Components at call-site by allowing them to accept additional generics.
 *
 * In some cases it also switches `onChange` handler from `(value: string) => void` to `(event: HTMLInputEvent<..>) => void`
 * to be used with `useFormState()` hook's e.g. `onInputChange` which accepts `EventStub` (`(ev: { target: { name, value }}) => void`).
 *
 * @example
 * interface FormState {a, b}
 *
 * // before
 * <Input name='yolo' />
 *
 * // after
 * <SliderInput<FormState>
 *  name='yolo' // 'yolo' is not assignable to 'a' | 'b'
 *  onChange={(value: string) => ...} // type (value: string) => void is not assignable to (ev: EventStub) => void
 * />
 */
type FormInput<C extends React.FC<any>> = <FormState extends AnyObject = { ___: true }>(...params: FormState extends { ___: true } ? Parameters<C> : [Parameters<C>[0] & { name: keyof FormState }]) => ReturnType<C>
