import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/lib/auth/consts'

export async function POST() {
  try {
    cookies().delete(SESSION_COOKIE_NAME)

    return new Response('Success!', {
      status: 200,
    })
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
