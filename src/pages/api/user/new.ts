import { type NextApiRequest, type NextApiResponse } from 'next'

import { add, type UserFormPayload } from '@/services/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (req.body || req.query) as UserFormPayload
  if (!payload.email || !payload.name || !payload.password)
    return res.status(400).json({ error: 'Missing required fields' })
  const result = await add(payload)
  res.status(200).json(result)
}
