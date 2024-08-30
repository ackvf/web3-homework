import { useCallback, useEffect, useState } from 'react'
import { getIronSession } from 'iron-session'
import { useSession } from 'next-auth/react'

import CoreAPIService from '@/services/CoreAPIService'
import { plaidClient, sessionOptions } from '@/services/plaid'
import UserService from '@/services/UserService'
import { Block } from '@/components'
import { Input } from '@/components/Atoms/Input'

export default function Purchase({ balance }: { balance: any }) {
  const account = balance.accounts[0].balances

  const { data: session } = useSession()
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [txs, setTxs] = useState([])

  useEffect(() => {
    if (session?.user?.email) UserService.get(session.user.email).then((v) => setAddress(v.address))
  }, [session?.user?.email])

  const handlePurchase = useCallback(async () => {
    if (!address) return
    if (amount > account.available) alert('Not enough balance.')

    const result = await CoreAPIService.post<string>('purchase-btc', {
      address,
      amount,
    })

    setTxs(JSON.parse(result))
  }, [account.available, address, amount])

  return (
    <div className='m-auto flex flex-col gap-4'>
      Available: {account.available} {account.iso_currency_code}
      <br />
      Wallet: {address}
      <Input<{ amount: number }>
        name='amount'
        label='Amount'
        placeholder='enter amount'
        type='number'
        max={Number(account.available)}
        onChange={(ev) => setAmount((ev.target as HTMLInputElement).value)}
        value={amount}
      />
      <button
        onClick={handlePurchase}
        className='mx-auto block h-14 w-60 cursor-pointer justify-center rounded-md border border-stone-600 bg-stone-200 px-4 text-stone-900 transition-colors duration-500 hover:bg-stone-400'
      >
        <span className='text-base font-normal uppercase'>PURCHASE BTC</span>
      </button>
      Note: This will only run in environment with available `bitcoin-cli` command.
      <Block className='max-h-80 w-fit min-w-full overflow-y-auto'>
        {txs.map((tx) => (
          <pre key={tx}>{tx}</pre>
        ))}
      </Block>
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
