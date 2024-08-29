import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      id="RootElement"
      className={`${inter.className} flex flex-col h-screen`}
    >
      <Head>
        <title>Exodus wallet by Qwerty</title>
        <meta name="description" content="Exodus wallet by Qwerty." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}
