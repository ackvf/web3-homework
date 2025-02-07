import { useLayoutEffect } from "react"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import Head from "next/head"

import { Cursor, Navigation } from "@/components"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {

  useLayoutEffect(() => {
    // Random background on page load
    document.getElementById("RootElement")?.classList.add("bg" + (((Math.random() * 7) | 0) + 1))
  }, [])

  return (
    <>
      <Cursor />
      <main id='RootElement' className={`${inter.className} flex h-screen flex-col pt-28`}>
        <Head>
          <title>Wallet by Qwerty</title>
          <meta name='description' content='Wallet by Qwerty.' />
          <link rel='icon' href='/favicon.png' />
        </Head>
        <Navigation />
        <Component {...pageProps} />
      </main >
    </>
  )

}
