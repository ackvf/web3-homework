import { useCallback } from "react"
import { parseEther } from "viem"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi"

import { useLessFormErrors, useLessFormState } from "@/hooks"
import { validations, type RuleSet } from "@/hooks/useLessFormErrors"
import { Block, Input } from "@/components"

interface FormState {
	address: Address
	amount: string
}

const validationRules: RuleSet<FormState> = {
	address: [validations.required, validations.onlyAddress, validations.minLength(42), validations.maxLength(42)],
	amount: [validations.required, validations.onlyDecimal(18)],
}

const initialState = { address: "" as Address, amount: "" } as FormState

export default function Send() {
	const { data: hash, sendTransaction, isPending } = useSendTransaction()
	const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
		hash,
	})

	const [formErrors, { checkFieldErrorsOnFormStateChange }] = useLessFormErrors<FormState>(validationRules)
	const [formState, { onInputChange }, , refState] = useLessFormState<FormState>(initialState, undefined, {
		onChange: checkFieldErrorsOnFormStateChange,
	})

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			console.log(refState.current) // formState is old state, refState.current is ALWAYS latest state.
			const to = refState.current.address
			const value = refState.current.amount
			sendTransaction({ to, value: parseEther(value) })
		},
		[refState, sendTransaction],
	)

	return (
		<main id="MainContentWrap" className="flex-grow pt-8">
			<Block id="SignUpForm" borderStyle="gradient">
				<div className="light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl">Enter transaction details</div>
				<form className="mt-8 flex flex-col gap-8" onSubmit={handleSubmit}>
					<Input<FormState>
						label="recipient address"
						placeholder='e.g. "0x1234567890123456789012345678901234567890"'
						name="address"
						onChange={onInputChange}
						value={formState.address}
					/>
					{formErrors.address && <div className="text-red-500">{formErrors.address}</div>}
					<Input<FormState>
						label="value [ETH]"
						placeholder="0.0001"
						name="amount"
						type="number"
						onChange={onInputChange}
						value={formState.amount}
					/>
					{formErrors.amount && <div className="text-red-500">{formErrors.amount}</div>}
					<div className="flex flex-col gap-4 md:flex-row md:gap-8">
						<button
							disabled={isPending}
							type="submit"
							className="mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400"
						>
							<span className="text-base font-normal uppercase">{isPending ? "Confirming..." : "Send"}</span>
						</button>
						{/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label='Save' type='submit' fullWidth /> */}
					</div>
					{hash && <div>Transaction Hash: {hash}</div>}
					{isConfirming && <div>Waiting for confirmation...</div>}
					{isConfirmed && <div>Transaction confirmed.</div>}
				</form>
			</Block>
		</main>
	)
}
