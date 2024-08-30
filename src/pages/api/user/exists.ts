import { type NextApiRequest, type NextApiResponse } from 'next'

import { get, type UserFormPayload } from '@/services/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (req.body || req.query) as Pick<UserFormPayload, 'email'>
  const exists = (await get(payload)) !== null
  res.status(200).json(exists)
}
