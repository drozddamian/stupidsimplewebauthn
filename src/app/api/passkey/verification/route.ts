import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { Authenticator } from '@/lib/auth/types'
import { origin, rpID, SESSION_COOKIE_NAME } from '@/lib/auth/consts'
import { getExistingUser, insertAuthenticator } from '@/lib/database/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { authenticatorResponse } = body

    if (!authenticatorResponse) {
      return new Response('Authenticator response are required', {
        status: 400,
      })
    }

    const username = cookies().get(SESSION_COOKIE_NAME)?.value

    if (!username) {
      return new Response('Unauthorized', {
        status: 400,
      })
    }

    const existingUser = await getExistingUser(username)

    if (!existingUser) {
      return new Response('Unauthorized', {
        status: 400,
      })
    }

    const verification = await verifyRegistrationResponse({
      response: authenticatorResponse,
      expectedChallenge: existingUser.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    })

    const { verified, registrationInfo } = verification

    if (!registrationInfo) {
      return new Response('Verification failed', {
        status: 400,
      })
    }

    const newAuthenticator: Authenticator = {
      credentialID: registrationInfo.credentialID,
      credentialPublicKey: registrationInfo.credentialPublicKey,
      counter: registrationInfo.counter,
      credentialDeviceType: registrationInfo.credentialDeviceType,
      credentialBackedUp: registrationInfo.credentialBackedUp,
      transports: authenticatorResponse.response.transports,
    }

    await insertAuthenticator(existingUser.id, newAuthenticator)

    return NextResponse.json({
      id: existingUser.id,
      verified,
    })
  } catch (error) {
    console.error('error: ', error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
