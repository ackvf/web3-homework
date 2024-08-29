import '@/styles/globals.css'
import { useLayoutEffect } from 'react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'

import { Navigation } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  useLayoutEffect(() => {
    document.getElementById('RootElement')?.classList.add('bg' + (((Math.random() * 7) | 0) + 1))
  }, [])

  return (
    <main id='RootElement' className={`${inter.className} flex h-screen flex-col`}>
      <Head>
        <title>Exodus wallet by Qwerty</title>
        <meta name='description' content='Exodus wallet by Qwerty.' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Navigation />
      <Component {...pageProps} />
    </main>
  )
}
