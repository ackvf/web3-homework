import * as bitcoin from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import { type NextApiRequest, type NextApiResponse } from 'next'
import * as ecc from 'tiny-secp256k1'

import { add, type UserFormPayload } from '@/services/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (req.body || req.query) as UserFormPayload
  if (!payload.email || !payload.name || !payload.password)
    return res.status(400).json({ error: 'Missing required fields' })
  const { address, pkey } = generateBitcoinAddress()
  const result = await add({ ...payload, address, pkey })
  res.status(200).json(result)
}

export const generateBitcoinAddress = () => {
  const network = bitcoin.networks.regtest
  const ECPair = ECPairFactory(ecc)
  const keyPair = ECPair.makeRandom()
  const pkey = keyPair.toWIF()
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
  return { pkey, address } as { pkey: string; address: string }
}
