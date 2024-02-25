import { getHashedPassword } from '@/lib/auth/utils'
import { getExistingUser, insertUser } from '@/lib/database/utils'
import { cookies } from 'next/headers'
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

    if (existingUser) {
      return new Response('Username already exists', {
        status: 409,
      })
    }

    const hashedPassword = await getHashedPassword(password)

    await insertUser(username, hashedPassword)

    cookies().set(SESSION_COOKIE_NAME, username)

    return new Response('Success!', {
      status: 200,
    })
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
