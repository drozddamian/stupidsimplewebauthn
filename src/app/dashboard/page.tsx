'use client'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { useRouter } from 'next/navigation'

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
      <button onClick={handleLogout}>Logout</button>

      <h1>{`Hello ${user.username}`}</h1>

      <div>
        <p className="text-xs">You can now add your passkey</p>

        <button
          className="font-bold text-sky-500"
          onClick={() => {
            console.log('todo')
          }}
        >
          Add passkey
        </button>
      </div>
    </div>
  )
}
