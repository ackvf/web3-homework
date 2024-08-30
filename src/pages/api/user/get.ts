import { type NextApiRequest, type NextApiResponse } from 'next'

import { get, type RedisUser, type UserFormPayload } from '@/services/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (req.body || req.query) as Pick<UserFormPayload, 'email'>
  const data: RedisUser | null = await get(payload)
  res.status(200).json(data)
}
