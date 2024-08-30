import { type NextApiRequest, type NextApiResponse } from 'next'

const { exec } = require('child_process')

/**
 * Generate BTC to target wallet address.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, amount, address } = (req.body || req.query) as { email: string; amount: string; address: string }

  const generateBitcoin = (amount: string, address: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      exec(`bitcoin-cli -regtest generatetoaddress ${amount} ${address}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`Error: ${error.message}`)
          reject(error)
        } else if (stderr) {
          console.error(`stderr: ${stderr}`)
          reject(new Error(stderr))
        } else {
          console.log(`stdout: ${stdout}`)
          resolve(stdout)
        }
      })
    })
  }

  try {
    const result = await generateBitcoin(amount, address)
    console.log(result)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}
