import { cookies } from 'next/headers'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { origin, rpID, SESSION_COOKIE_NAME } from '@/lib/auth/consts'
import {
  getExistingUser,
  getExistingUserAuthenticatorById,
  updateAuthenticatorCounter,
} from '@/lib/database/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { username, authenticationResponse } = body

    if (!authenticationResponse || !username) {
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

    const authenticator = await getExistingUserAuthenticatorById(
      existingUser.id,
      authenticationResponse.id,
    )

    if (!authenticator) {
      return new Response('Unauthorized', {
        status: 400,
      })
    }

    const verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge: existingUser.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        counter: authenticator.counter,
        transports: authenticator?.transports,
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
      },
    })

    const { authenticationInfo } = verification
    const { newCounter } = authenticationInfo

    await updateAuthenticatorCounter(
      isoBase64URL.fromBuffer(authenticator.credentialID),
      newCounter,
    )

    cookies().set(SESSION_COOKIE_NAME, username)

    return new Response('Login successful', {
      status: 200,
    })
  } catch (error) {
    console.error('error: ', error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
