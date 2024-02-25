import { useEffect, useState } from 'react'
import { Authenticator } from '@/lib/auth/types'

export const PasskeysList = () => {
  const [passkeys, setPasskeys] = useState<Authenticator[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthenticators() {
      const response = await fetch('/api/passkey/retrieve')

      if (response.ok) {
        const { authenticators } = await response.json()
        setPasskeys(authenticators)
      } else {
        console.error('Failed to fetch authenticators')
      }
      setLoading(false)
    }

    fetchAuthenticators()
  }, [])

  if (loading) {
    return <p className="text-xs">Loading Authenticators...</p>
  }

  if (!passkeys || passkeys.length < 1) {
    return <p className="text-xs">No Authenticators yet</p>
  }

  return (
    <div>
      <h2 className="text-l mb-4">Your Authenticators</h2>

      <div className="flex-col">
        {passkeys.map((passkey, index) => (
          <div className="mb-2 flex flex-row" key={passkey.id}>
            <span className="mr-4 text-xl">{index})</span>

            <div>
              <h3>credentialDeviceType: {passkey.credentialDeviceType}</h3>
              <p>Counter: {passkey.counter}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
