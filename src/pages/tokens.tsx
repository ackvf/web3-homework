import React, { useEffect, useState } from "react"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { readContract } from "wagmi/actions"

import { useShallowState } from "@/hooks"
import { config } from "@/web3.config"
import { Block } from "@/components"

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

const TokenList: React.FC = () => {
	const { address, isConnected } = useAccount()
	const [tokensData, setTokenData] = useShallowState<TokenData>({})
	const [customAddresses, setCustomAddresses] = useState<Address[]>([])

	useEffect(() => {
		if (!isConnected || !address) return

		const tokenAddresses = Object.keys(knownTokens) as Address[]

		tokenAddresses.forEach(async (tokenAddress: Address) => {
			fetchToken(tokenAddress, address).then(setTokenData)
		})
	}, [isConnected, address, setTokenData])


	useEffect(() => {
		if (!isConnected || !address || !customAddresses.length) return

		const tokenAddresses = customAddresses

		tokenAddresses.filter(a => !tokensData[a]).forEach(async (tokenAddress: Address) => {
			fetchToken(tokenAddress, address).then(setTokenData)
		})
	}, [isConnected, customAddresses, setTokenData, address, tokensData])

	return (
		<main id='MainContentWrap' className='flex-grow pt-8'>
			<Block id='SignUpForm' borderStyle='gradient' >
				<div className='light:text-light-500 md:leading-2xl text-stone-500 md:text-2xl'>
					<h1 className='text-stone-300 pb-4'>Your ERC20 Tokens </h1>
					<ul>
						{
							Object.keys(tokensData).map((address: any, index) => (
								<li key={index} >
									{tokensData[address].symbol}: {tokensData[address].balance}
								</li>
							))
						}
						<li>
							<input
								type="text"
								className='mt-6 w-full text-xl'
								placeholder="Enter custom token address; Press [Enter] to confirm."
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										const newAddress = e.currentTarget.value as Address
										if (newAddress) {
											setCustomAddresses(prev => [...prev, newAddress])
											e.currentTarget.value = ""
										}
									}
								}}
							/>
						</li>
					</ul>
				</div>
			</Block>
		</main>
	)
}

export default TokenList

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

interface TokenData {
	[key: Address]: {
		address: Address
		balance: string
		decimals: number
		symbol: string
	}
}

const knownTokens = {
	// AAve USDC - https://app.aave.com/
	"0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8": {
		name: "USDC",
		decimals: 6,
		symbol: "USDC",
	},
	// AAve USDT - https://app.aave.com/
	"0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0": {
		name: "USDT",
		decimals: 6,
		symbol: "USDT",
	},
	// // AAve DAI - https://app.aave.com/
	// "0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357": {
	// 	name: "DAI",
	// 	decimals: 18,
	// 	symbol: "DAI",
	// },
} as const
