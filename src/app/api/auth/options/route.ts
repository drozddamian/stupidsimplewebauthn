import { NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { rpID } from '@/lib/auth/consts'
import {
  getExistingUser,
  updateChallengeForUser,
  getExistingUserAuthenticators,
} from '@/lib/database/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username } = body

    if (!username) {
      return new Response('Username is required', {
        status: 400,
      })
    }

    const existingUser = await getExistingUser(username)

    if (!existingUser) {
      return new Response('Unauthorized', {
        status: 400,
      })
    }

    const userAuthenticators = await getExistingUserAuthenticators(
      existingUser.id,
    )

    const allowCredentials = userAuthenticators?.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: authenticator.transports,
    }))

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      // @ts-ignore
      allowCredentials,
    })

    await updateChallengeForUser(existingUser.id, options.challenge)

    return NextResponse.json(options)
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
