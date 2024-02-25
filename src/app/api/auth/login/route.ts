import { cookies } from 'next/headers'
import { comparePassword } from '@/lib/auth/utils'
import { getExistingUser } from '@/lib/database/utils'
import { SESSION_COOKIE_NAME } from '@/lib/auth/consts'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return new Response('Username and password are required', {
        status: 400,
      })
    }

    const existingUser = await getExistingUser(username)

    if (!existingUser) {
      return new Response('User does not exist', {
        status: 400,
      })
    }

    const { isPasswordMatch } = await comparePassword(
      password,
      existingUser.password,
    )

    if (!isPasswordMatch) {
      return new Response('Incorrect password', {
        status: 401,
      })
    }

    cookies().set(SESSION_COOKIE_NAME, username)

    return new Response('Login successful', {
      status: 200,
    })
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
