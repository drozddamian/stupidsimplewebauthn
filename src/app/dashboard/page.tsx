'use client'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { useRouter } from 'next/navigation'
import { PasskeysList } from '@/components/PasskeysList'
import { AddNewAuthenticatorButton } from '@/components/AddNewAuthenticatorButton'

export default function Dashboard() {
  const { push } = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch('/api/dashboard')

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        console.error('Failed to fetch user data')
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await push('/')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <div>
      <button
        className="absolute right-10 top-10 border p-2"
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className="mb-10 text-xl">{`Hello ${user.username}`}</h1>

      <div>
        <PasskeysList />

        <AddNewAuthenticatorButton />
      </div>
    </div>
  )
}
