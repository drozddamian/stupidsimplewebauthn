import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'

export const AddNewAuthenticatorButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleInitAddAuthenticator = async () => {
    try {
      setIsLoading(true)
      const optionsResponse = await fetch('/api/passkey/options', {
        method: 'POST',
      })

      const authOptions = await optionsResponse.json()
      const authenticatorResponse = await startRegistration(authOptions)

      await fetch('/api/passkey/verification', {
        method: 'POST',
        body: JSON.stringify({ authenticatorResponse }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-row">
      <button
        className="mt-4 border p-2 font-bold text-sky-500"
        onClick={handleInitAddAuthenticator}
      >
        Add new Authenticator
      </button>

      {isLoading && <span className="pl-2">Loading...</span>}
    </div>
  )
}
