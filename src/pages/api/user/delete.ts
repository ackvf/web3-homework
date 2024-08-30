import { type NextApiRequest, type NextApiResponse } from 'next'

import { remove, type UserFormPayload } from '@/services/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (req.body || req.query) as Pick<UserFormPayload, 'email'>
  const result = await remove(payload)
  res.status(200).json(result)
}
