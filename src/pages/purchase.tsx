import { useEffect, useState } from 'react'
import { getIronSession } from 'iron-session'
import { useSession } from 'next-auth/react'

import { plaidClient, sessionOptions } from '@/services/plaid'
import UserService from '@/services/UserService'

export default function Purchase({ balance }: { balance: any }) {
  const { data: session } = useSession()
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (session?.user?.email) UserService.get(session.user.email).then((v) => setAddress(v.address))
  }, [session?.user?.email])

  console.debug('session', session)

  const account = balance.accounts[0].balances
  return (
    <div className='m-auto flex flex-col gap-4'>
      Available: {account.available} {account.iso_currency_code}
      <br />
      Wallet: {address}
      <button
        onClick={() => {
          alert('Not available')
        }}
        className='mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400'
      >
        <span className='text-base font-normal uppercase'>PURCHASE BTC</span>
      </button>
    </div>
  )
}

export async function getServerSideProps({ req, res }: any) {
  const session = await getIronSession(req, res, sessionOptions)
  //@ts-expect-error
  const access_token = session.access_token

  if (!access_token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await plaidClient.accountsBalanceGet({ access_token })
  return {
    props: {
      balance: response.data,
    },
  }
}
