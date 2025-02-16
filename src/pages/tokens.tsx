import React, { useCallback, useEffect, useState } from "react"
import { Network } from "alchemy-sdk"
import { parseEther, parseUnits } from "viem"
import type { sendTransaction } from "viem/actions"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { alchemy, alchemySettings } from "@/alchemy"
import { useLessFormState, useShallowState } from "@/hooks"
import { useLessFormErrors, validations, type RuleSet } from "@/hooks/useLessFormErrors"
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

const TokenList: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [tokensData, setTokenData] = useShallowState<TokensData>({})

  const tokenAddresses = Object.keys(tokensData) as Address[]

  const [filter_, setFilter] = useState<string>("")
  const filterKeywords = filter_.toLowerCase().split(" ")

  const [selectedTokenAddress, selectTokenForSending] = useState("" as Address)

  const selectedTokenData = tokensData[selectedTokenAddress as Address]

  /*  */

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const [formErrors, { checkFieldErrorsOnFormStateChange }] = useLessFormErrors<FormState>(validationRules)
  const [formState, { onInputChange }, , refState] = useLessFormState<FormState>(initialState, undefined, {
    onChange: checkFieldErrorsOnFormStateChange,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!selectedTokenData) return

      const to = refState.current.address
      const amount = parseUnits(refState.current.amount, selectedTokenData.decimals!)

      console.debug("sending", { to, amount })

      writeContract({
        abi: ERC20_ABI,
        address: selectedTokenAddress,
        functionName: "transfer",
        args: [to, amount],
      })
    },
    [refState, selectedTokenAddress, selectedTokenData, writeContract],
  )

  useEffect(() => {
    if (!isConnected || !address) return
    ;(async () => {
      try {
        const tokenBalances: TokensData = await alchemy.core.getTokenBalances(address).then((r) =>
          r.tokenBalances.reduce((acc, { contractAddress, tokenBalance }) => {
            acc[contractAddress as Address] = {
              contractAddress: contractAddress as Address,
              tokenBalance: tokenBalance!,
            } as TokensData[Address]
            return acc
          }, {} as TokensData),
        )

        const tokenContractsAddresses = Object.keys(tokenBalances) as Address[]

        await Promise.allSettled(
          tokenContractsAddresses.map((contractAddress) => alchemy.core.getTokenMetadata(contractAddress)),
        ).then((metadataPromises) => {
          return metadataPromises.forEach((p, ix) => {
            if (p.status === "fulfilled") {
              const contractAddress = tokenContractsAddresses[ix]
              const { decimals, logo, name, symbol } = p.value
              tokenBalances[contractAddress] = {
                ...tokenBalances[contractAddress],
                tokenBalance: formatBalance(tokenBalances[contractAddress].tokenBalance, decimals!),
                decimals,
                name,
                symbol,
                logo,
              }
            }
          })
        })

        setTokenData(tokenBalances)

        // TODO: get token prices
        if (alchemySettings.network === Network.ETH_MAINNET) {
          const prices = await alchemy.prices.getTokenPriceByAddress(
            tokenContractsAddresses.map((address) => ({
              network: Network.ETH_MAINNET,
              address,
            })),
          )
          console.log("prices", prices)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [isConnected, address, setTokenData])

  return (
    <main id="MainContentWrap" className="flex-grow pt-8">
      <Block id="SignUpForm" borderStyle="gradient">
        <div className="light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl">
          <h1 className="pb-4 text-stone-300">Found {tokenAddresses.length} ERC20 Tokens </h1>
          <input
            type="text"
            className="mt-6 w-full text-xl"
            placeholder="filter tokens"
            onChange={(e) => setFilter(e.currentTarget.value)}
          />
          <hr className="my-4" />
          {selectedTokenAddress && (
            <div>
              <div className="light:text-light-500 md:leading-2xl mb-2 text-stone-500 md:text-2xl">
                Enter transaction details
              </div>
              <div className="mb-4 text-xs uppercase">SYMBOL: {tokensData[selectedTokenAddress].symbol}</div>
              <div className="mb-4 text-xs uppercase">ADDRESS: {tokensData[selectedTokenAddress].contractAddress}</div>
              <div className="mb-4 text-xs uppercase">BALANCE: {tokensData[selectedTokenAddress].tokenBalance}</div>
              <form className="mt-2 flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    disabled={isPending || isConfirming}
                    type="submit"
                    className="mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400"
                  >
                    <span className="text-base font-normal uppercase">{isPending ? "Confirming..." : "Send"}</span>
                  </button>
                  <button
                    disabled={isPending || isConfirming}
                    type="button"
                    onClick={() => selectTokenForSending("" as Address)}
                    className="hover:text-dark-400 mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-400 bg-stone-800 px-4 text-stone-200 transition-colors duration-500"
                  >
                    <span className="text-base font-normal uppercase">Cancel</span>
                  </button>
                  {/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label='Save' type='submit' fullWidth /> */}
                </div>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for network...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
              </form>
              <hr className="my-4" />
            </div>
          )}
          <ul>
            {Object.values<TokenData>(tokensData as any)
              .filter(
                (data) =>
                  filterKeywords.every((kw) => data.symbol?.toLowerCase().includes(kw)) ||
                  filterKeywords.every((kw) => data.name?.toLowerCase().includes(kw)) ||
                  filterKeywords.every((kw) => data.contractAddress.includes(kw)),
              )
              .map((data, index) => (
                <li
                  key={data.contractAddress}
                  className={`flex ${selectedTokenAddress === data.contractAddress ? "bg-stone-200 outline-dashed outline-1" : ""} justify-between overflow-hidden`}
                >
                  <button className="cursor-click" onClick={() => selectTokenForSending(data.contractAddress)}>
                    📤
                  </button>
                  <div className="flex grow justify-between overflow-hidden">
                    <span>{data.symbol}:</span> <span>{data.tokenBalance}</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </Block>
    </main>
  )
}

export default TokenList

function formatBalance(value: string, decimals: number): string {
  return (parseInt(value, 16) / Math.pow(10, decimals)).toFixed(decimals)
}

interface TokensData {
  [key: Address]: TokenData
}

type TokenData = TokenBalances & TokenMetadata
/* & { // TODO, only on mainnet // price?: string } */

interface TokenBalances {
  contractAddress: Address
  tokenBalance: string
}

interface TokenMetadata {
  decimals: number | null
  name: string | null
  symbol: string | null
  logo: string | null
}

const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
]

/*
// Using blockchain calls (contracts) instead of Alchemy API

const ERC20_ABI = [
	// "function balanceOf(address owner) view returns (uint256)",
	// "function decimals() view returns (uint8)",
	// "function symbol() view returns (string)",
	{
		type: "function",
		name: "balanceOf",
		stateMutability: "view",
		inputs: [{ name: "account", type: "address" }],
		outputs: [{ type: "uint256" }],
	},
	{
		type: "function",
		name: "decimals",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint8" }],
	},
	{
		type: "function",
		name: "symbol",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "string" }],
	},
]

const fetchToken = async (tokenAddress: Address, userAddress: Address): Promise<TokenData> => {
	const [balance, decimals, symbol]: any[] = await Promise.all([readContract(config, {
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: "balanceOf",
		args: [userAddress],
	}), readContract(config, {
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: "decimals",
		args: [],
	}), readContract(config, {
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: "symbol",
		args: [],
	})])

	return {
		[tokenAddress]: {
			address: tokenAddress,
			balance: formatUnits(balance, decimals),
			decimals,
			symbol,
		},
	}
}
*/
