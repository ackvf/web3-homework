import { useLayoutEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import Head from "next/head"
import { WagmiProvider } from "wagmi"

import "@/styles/globals.css"
import { config } from "@/web3.config"
import { Cursor, Navigation } from "@/components"

const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {

  useLayoutEffect(() => {
    // Random background on page load
    document.getElementById("RootElement")?.classList.add("bg" + (((Math.random() * 7) | 0) + 1))
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <Cursor />
      <main id="RootElement" className={`${inter.className} flex h-screen flex-col pt-28`}>
        <Head>
          <title>Wallet by Qwerty</title>
          <meta name="description" content="Wallet by Qwerty." />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Navigation />
        <Component {...pageProps} />
        </main >
      </QueryClientProvider>
    </WagmiProvider>
  )

}
