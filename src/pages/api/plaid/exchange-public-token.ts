import { getIronSession } from 'iron-session'
import type { NextApiRequest, NextApiResponse } from 'next'

import { plaidClient, sessionOptions } from '@/services/plaid'

export default async function exchangePublicTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession(req, res, sessionOptions)

  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: req.body.public_token,
  })

  //@ts-expect-error
  session.access_token = exchangeResponse.data.access_token
  await session.save()
  res.send({ ok: true })
}
