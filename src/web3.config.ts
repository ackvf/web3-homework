import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { sepolia } from "wagmi/chains"

export const config = getDefaultConfig({
	appName: "homework",
	projectId: "YOUR_PROJECT_ID", // TODO
	chains: [sepolia],
	transports: {
		[sepolia.id]: http(),
	},
	ssr: false,
})

declare module "wagmi" {
	interface Register {
		config: typeof config
	}
}
