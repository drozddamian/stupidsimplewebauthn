import type { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { rpID, rpName } from '@/lib/auth/consts'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    /*
    const userAuthenticators: Authenticator[] = getUserAuthenticators(user)

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.username,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
        // Optional
        transports: authenticator.transports,
      })),
      // See "Guiding use of authenticators via authenticatorSelection" below
      authenticatorSelection: {
        // Defaults
        residentKey: 'preferred',
        userVerification: 'preferred',
        // Optional
        authenticatorAttachment: 'platform',
      },
    })

    // Example: Generate a registration challenge and options
    const challenge = 'your_generated_challenge_here'

    res.status(200).json({ success: true, challenge: challenge })

     */
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
