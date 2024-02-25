import { cookies } from 'next/headers'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { origin, rpID, SESSION_COOKIE_NAME } from '@/lib/auth/consts'
import {
  getExistingUser,
  getExistingUserAuthenticatorById,
} from '@/lib/database/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, authenticatorResponse } = body

    if (!authenticatorResponse || !username) {
      return new Response('Authenticator response and username are required', {
        status: 400,
      })
    }

    const existingUser = await getExistingUser(username)

    if (!existingUser) {
      return new Response('Unauthorized', {
        status: 400,
      })
    }

    const authenticator = getExistingUserAuthenticatorById(
      existingUser.id,
      body.id,
    )

    await verifyAuthenticationResponse({
      response: authenticatorResponse,
      expectedChallenge: existingUser.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    })

    cookies().set(SESSION_COOKIE_NAME, username)

    return new Response('Login successful', {
      status: 200,
    })
  } catch (error) {
    console.log('error: ', error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
