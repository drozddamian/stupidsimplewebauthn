'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { startAuthentication } from '@simplewebauthn/browser'

type LoginFlowStep = 'username' | 'password'

export const LoginForm = () => {
  const { push } = useRouter()

  const [loginFlowStep, setLoginFlowStep] = useState<LoginFlowStep>('username')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (loginFlowStep === 'username') {
      const loginOptionsResponse = await fetch('api/auth/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const options = await loginOptionsResponse.json()
      const { allowCredentials } = options

      if (allowCredentials?.length === 0) {
        setLoginFlowStep('password')
        return
      }

      try {
        const authenticationResponse = await startAuthentication(options)

        const verificationResponse = await fetch('/api/auth/verification', {
          method: 'POST',
          body: JSON.stringify({ username, authenticationResponse }),
        })

        if (!verificationResponse.ok) {
          setErrorMessage(verificationResponse.statusText)
        } else {
          push('/dashboard')
        }
      } catch (error) {
        console.error('error: ', error)
        setErrorMessage(JSON.stringify(error))
      }
    }

    if (loginFlowStep === 'password') {
      const passwordAuthResponse = await fetch('api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      if (!passwordAuthResponse.ok) {
        setErrorMessage(passwordAuthResponse.statusText)
      } else {
        push('/dashboard')
      }
    }
  }

  return (
    <form
      className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
      onSubmit={handleSubmit}
    >
      {loginFlowStep === 'username' && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            id="username"
            placeholder="Username"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            autoComplete="webauthn"
          />
        </div>
      )}

      {loginFlowStep === 'password' && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            id="password"
            placeholder="******************"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
      )}

      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}

      <div className="flex items-center justify-between">
        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  )
}
