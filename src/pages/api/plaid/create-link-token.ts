import type { NextApiRequest, NextApiResponse } from 'next'
import { CountryCode, Products } from 'plaid'

import { plaidClient } from '@/services/plaid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID! },
    client_name: "Plaid's Tiny Quickstart",
    language: 'en',
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  })

  return res.json(tokenResponse.data)
}
