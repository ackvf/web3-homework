import { useMemo, type HTMLInputTypeAttribute } from "react"
import { twMerge } from "tailwind-merge"

//@ts-ignore
export const Input: FormInput<React.FC<InputProps | TextareaProps | NumberInputProps>> = ({
  id,
  name,
  value = "",
  label = "",
  labelVariant = "caption",
  rightLabel = "",
  align = "left",
  type = "text",
  placeholder = "",
  error = "",
  autoFocus = false,
  min,
  max,
  maxLength,
  maxDecimalLength = 0,
  rows,
  readOnly = false,
  disabled,
  className = "",
  onChange,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}) => {
  const inputProps = {
    id,
    name,
    autoFocus,
    placeholder: String(placeholder || ""),
    maxLength,
    readOnly,
    disabled,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    min,
    max,
  }

  const isTextArea = type === "textarea" && rows !== undefined

  const inputWrapperClassName = useMemo(
    () =>
      twMerge(
        "w-full flex gap-4",
        !readOnly && getBorderStyles(!isTextArea ? "input" : "textarea"),
        !readOnly &&
          "hover:border-stone-400 focus-within:border-stone-500 border-stone-600 disabled:border-stone-800:disabled",
      ),
    [readOnly, isTextArea],
  )

  const inputClassName = useMemo(
    () =>
      twMerge(
        textAlignments[align],
        "bg-transparent outline-none w-full",
        readOnly && "!min-h-fit",
        "pb-2",
        // padding
        getSpacingStyles(!isTextArea ? "input" : "textarea", readOnly),
        // text style
        "font-extralight tracking-body",
        "text-stone-200 disabled:text-stone-400",
        // placeholder text style
        "placeholder:text-stone-400 placeholder:disabled:text-stone-500",
      ),
    [align, isTextArea, readOnly],
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === "number") {
      const decimalDigits = event.target.value?.split(".") || []
      if (maxDecimalLength !== 0 && (decimalDigits?.[1]?.length ?? 0) > maxDecimalLength) {
        return
      }
    }
    onChange?.(event)
  }

  const suffixSection = useMemo(() => {
    if (!rightLabel) return <></>

    switch (typeof rightLabel) {
      case "string":
      case "number":
        return <div className="text-stone-400">{rightLabel}</div>
      default:
        return rightLabel
    }
  }, [rightLabel])

  return (
    <div className={twMerge("w-full cursor-text", error && "-mb-6", className)}>
      {label && <div className="mb-4 text-xs uppercase">{label}</div>}
      <div className={inputWrapperClassName}>
        {!isTextArea ? (
          <input
            {...inputProps}
            type={type}
            className={inputClassName}
            value={String(value || "")}
            onChange={handleChange}
          />
        ) : (
          <textarea
            {...inputProps}
            rows={rows}
            className={inputClassName}
            value={String(value || "")}
            onChange={handleChange}
          />
        )}

        {suffixSection}
      </div>
      {error && <div className="mt-2 text-orange-800">{error}</div>}
    </div>
  )
}

type InputElements = "input" | "textarea"

export const textAlignments = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
  justify: "text-justify",
} as const

export const getBorderStyles = (element: InputElements) => {
  switch (element) {
    case "input":
      return "border-b"
    case "textarea":
      return "border rounded-sm"
    default:
      return ""
  }
}

export const getSpacingStyles = (element: InputElements, readOnly: boolean) => {
  switch (element) {
    case "input":
      return "px-0"
    case "textarea":
      return `mt-[5px] py-xs ${readOnly ? "" : " px-sm"}`
    default:
      return ""
  }
}

export type TextAlignments = "left" | "center" | "right"

export interface InputProps extends SelectedHTMLInputProps {
  name: string

  label?: string
  labelVariant?: "label" | "caption"

  rightLabel?: React.ReactNode

  className?: string

  /** default: `left` */
  align?: TextAlignments

  error?: string

  /** decimal precision */
  maxDecimalLength?: never
  min?: never
  max?: never

  /** default: `text` */
  type?: Exclude<HTMLInputTypeAttribute, "textarea" | "number">
  rows?: never // TODO fix: rows are still accepted on normal inputs and not required on textarea
}

type SelectedHTMLInputProps = Pick<
  React.HTMLProps<HTMLInputElement | HTMLTextAreaElement>,
  | "autoFocus"
  | "disabled"
  | "id"
  | "onBlur"
  | "onChange"
  | "onMouseEnter"
  | "onMouseLeave"
  | "placeholder"
  | "readOnly"
  | "value"
  | "maxLength"
>

export type TextareaProps = Modify<
  InputProps,
  {
    type: "textarea"
    rows: number
  }
>

export type NumberInputProps = Modify<
  InputProps,
  {
    type: "number"
    maxDecimalLength?: number
    min?: number
    max?: number
  }
>
