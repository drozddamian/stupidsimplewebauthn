import { cookies } from 'next/headers'
import {
  getExistingUser,
  getExistingUserAuthenticators,
} from '@/lib/database/utils'
import { SESSION_COOKIE_NAME } from '@/lib/auth/consts'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    console.log('userAuthenticators: ', userAuthenticators)

    return NextResponse.json({
      id: existingUser.id,
      authenticators: userAuthenticators,
    })
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
