import React, { useCallback, useEffect, useState } from "react"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { alchemy } from "@/alchemy"
import { useLessFormErrors, useLessFormState, useShallowState } from "@/hooks"
import { type RuleSet, validations } from "@/hooks/useLessFormErrors"
import { Block, Input } from "@/components"

interface FormState {
  address: Address
}

const validationRules: RuleSet<FormState> = {
  address: [validations.required, validations.onlyAddress, validations.minLength(42), validations.maxLength(42)],
}

const initialState = { address: "" as Address } as FormState

const NFTList: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [tokensData, setTokenData] = useShallowState<TokensData>({})

  const [filter_, setFilter] = useState<string>("")
  const filterKeywords = filter_.toLowerCase().split(" ")

  const [selectedToken, selectTokenForSending] = useState({ contract: "" as Address, tokenId: "" })

  const selectedTokenData: TokenData | undefined = tokensData[selectedToken.contract as Address]?.find(
    (data) => data.tokenId === selectedToken.tokenId,
  )

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

      writeContract({
        abi: NFT_ABI[selectedTokenData.tokenType],
        address: selectedToken.contract,
        functionName: "safeTransferFrom",
        args: [address, to, selectedToken.tokenId],
      })
    },
    [refState, selectedToken.contract, writeContract], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    if (!isConnected || !address) return

    alchemy.nft
      .getNftsForOwner(address)
      .then((r) =>
        r.ownedNfts.reduce((acc, ownedNft) => {
          const {
            contract: { address: contractAddress, name, symbol, tokenType },
            description,
            image: { originalUrl },
            tokenId,
          } = ownedNft
          const current = (acc[contractAddress as Address] ??= [])

          current.push({
            contractAddress,
            tokenId,
            name,
            symbol,
            imgUrl: originalUrl,
            description,
            tokenType,
          } as TokenData)

          console.debug("acc", acc)

          return acc
        }, {} as TokensData),
      )
      .then(setTokenData)
  }, [isConnected, address, setTokenData])

  return (
    <main id="MainContentWrap" className="flex-grow pt-8">
      <Block id="SignUpForm" borderStyle="gradient">
        <div className="light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl">
          <h1 className="pb-4 text-stone-300">Found {Object.values(tokensData).flat().length} NFTs </h1>
          <input
            type="text"
            className="mt-6 w-full text-xl"
            placeholder="filter tokens"
            onChange={(e) => setFilter(e.currentTarget.value)}
          />
          <hr className="my-4" />
          {selectedToken.contract && (
            <div>
              <div className="light:text-light-500 md:leading-2xl mb-2 text-stone-500 md:text-2xl">
                Enter transaction details
              </div>
              <img className="mb-4 max-h-20 max-w-20" src={selectedTokenData?.imgUrl} />
              <div className="mb-4 text-xs uppercase">SYMBOL: {selectedTokenData?.symbol}</div>
              <div className="mb-4 text-xs uppercase">ADDRESS: {selectedTokenData?.contractAddress}</div>
              <div className="mb-4 text-xs uppercase">TOKEN ID: {selectedTokenData?.tokenId}</div>
              <form className="mt-2 flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input<FormState>
                  label="recipient address"
                  placeholder="e.g. '0x1234567890123456789012345678901234567890'"
                  name="address"
                  onChange={onInputChange}
                  value={formState.address}
                />
                {formErrors.address && <div className="text-red-500">{formErrors.address}</div>}
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
                    onClick={() => selectTokenForSending({ contract: "" as Address, tokenId: "" })}
                    className="hover:text-dark-400 mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-400 bg-stone-800 px-4 text-stone-200 transition-colors duration-500"
                  >
                    <span className="text-base font-normal uppercase">Cancel</span>
                  </button>
                  {/* <Button disabled={isLocked || !isFormValid} loading={isLocked} label="Save" type="submit" fullWidth /> */}
                </div>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for network...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
              </form>
              <hr className="my-4" />
            </div>
          )}
          <ul>
            {Object.values<TokenData[]>(tokensData as any)
              .flat()
              .filter(
                (data) =>
                  filterKeywords.every((kw) => data.symbol?.toLowerCase().includes(kw)) ||
                  filterKeywords.every((kw) => data.name?.toLowerCase().includes(kw)) ||
                  filterKeywords.every((kw) => data.description?.toLowerCase().includes(kw)) ||
                  filterKeywords.every((kw) => data.contractAddress.includes(kw)),
              )
              .map((data, index) => (
                <li key={data.contractAddress + data.tokenId} className="flex justify-between overflow-hidden">
                  <div className="flex flex-col">
                    <span>
                      <button
                        className="cursor-click inline-block"
                        onClick={() => selectTokenForSending({ contract: data.contractAddress, tokenId: data.tokenId })}
                      >
                        📤
                      </button>
                      <span>{data.symbol}</span>
                      <span>#{data.tokenId}</span>
                    </span>
                    <p className="text-sm">{data.description}</p>
                  </div>
                  <img src={data.imgUrl} className="max-h-20 max-w-20" />
                </li>
              ))}
          </ul>
        </div>
      </Block>
    </main>
  )
}

export default NFTList

interface TokensData {
  [key: Address]: TokenData[]
}

interface TokenData {
  contractAddress: Address
  tokenId: string
  name: string
  symbol: string
  imgUrl: string
  description: string
  tokenType: "ERC721" | "ERC1155"
}

const ERC721_ABI = [
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
]

const ERC1155_ABI = [
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
]

const NFT_ABI = {
  ERC721: ERC721_ABI,
  ERC1155: ERC1155_ABI,
}
