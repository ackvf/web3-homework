import { Alchemy, Network } from "alchemy-sdk"

export const alchemySettings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
}

export const alchemy = new Alchemy(alchemySettings)
