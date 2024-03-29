import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { rpID, rpName, SESSION_COOKIE_NAME } from '@/lib/auth/consts'
import {
  getExistingUser,
  updateChallengeForUser,
  getExistingUserAuthenticators,
} from '@/lib/database/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { authenticatorOptions } = body

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

    const userAuthenticators = await getExistingUserAuthenticators(
      existingUser.id,
    )

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: existingUser.id,
      userName: existingUser.username,
      attestationType: 'direct',
      excludeCredentials: userAuthenticators?.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
        transports: authenticator.transports,
      })),
      authenticatorSelection: {
        residentKey: authenticatorOptions.residentKeyRequirement,
        userVerification: authenticatorOptions.userVerification,
        authenticatorAttachment: authenticatorOptions.authenticatorAttachment,
      },
    })

    await updateChallengeForUser(existingUser.id, options.challenge)

    return NextResponse.json(options)
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
