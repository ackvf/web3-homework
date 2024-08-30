import { useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import { usePlaidLink, type PlaidLinkOnSuccessMetadata } from 'react-plaid-link'

import { ROUTE } from '@/routes'
import PlaidService from '@/services/PlaidService'

export default function PlaidLink() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const createLinkToken = async () => {
      const { link_token } = await PlaidService.createLinkToken()
      setToken(link_token)
    }
    createLinkToken()
  }, [])

  const onSuccess = useCallback(async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    await PlaidService.exchangePublicToken(publicToken)
    Router.push(ROUTE.PLAID_DASHBOARD)
  }, [])

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  })

  return (
    <div className='m-auto flex flex-col gap-4'>
      <button
        onClick={() => open()}
        disabled={!ready}
        className='mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400'
      >
        <span className='text-base font-normal uppercase'>LINK ACCOUNT</span>
      </button>
    </div>
  )
}
