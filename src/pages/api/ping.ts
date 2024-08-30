import { type NextApiRequest, type NextApiResponse } from 'next'

import { ping } from '@/services/redis'

/**
 * Test the connection to the Redis database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ redis: await ping() })
}
