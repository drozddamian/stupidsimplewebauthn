import { ChangeEvent, useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import { UserVerification } from '@/components/AuthenticatorOptions/UserVerification'
import {
  UserVerificationRequirement,
  ResidentKeyRequirement,
  AuthenticatorAttachment,
} from '@/types'
import { ResidentKeyRequirementRadio } from '@/components/AuthenticatorOptions/ResidentKeyRequirementRadio'
import { AuthenticatorAttachmentRadio } from '@/components/AuthenticatorOptions/AuthenticatorAttachmentRadio'

export const AddNewAuthenticatorButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [userVerification, setUserVerification] =
    useState<UserVerificationRequirement>('preferred')

  const [residentKeyRequirement, setResidentKeyRequirement] =
    useState<ResidentKeyRequirement>('preferred')

  const [authenticatorAttachment, setAuthenticatorAttachment] =
    useState<AuthenticatorAttachment>('platform')

  const handleInitAddAuthenticator = async () => {
    try {
      setIsLoading(true)

      const authenticatorOptions = {
        userVerification,
        residentKeyRequirement,
        authenticatorAttachment,
      }

      const optionsResponse = await fetch('/api/passkey/options', {
        method: 'POST',
        body: JSON.stringify({ authenticatorOptions }),
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

  const handleUserVerificationRadioInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setUserVerification(event.target.value as UserVerificationRequirement)
  }

  const handleResidentKeyRadioInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setResidentKeyRequirement(event.target.value as ResidentKeyRequirement)
  }

  const handleAuthenticatorAttachmentRadioInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setAuthenticatorAttachment(event.target.value as AuthenticatorAttachment)
  }

  return (
    <div className="flex-row">
      <button
        className="mt-4 border p-2 font-bold text-sky-500"
        onClick={handleInitAddAuthenticator}
      >
        Add new Authenticator
      </button>

      <div className="flex-col pt-10">
        <UserVerification
          selectedOption={userVerification}
          handleUserVerificationRadioInputChange={
            handleUserVerificationRadioInputChange
          }
        />

        <ResidentKeyRequirementRadio
          selectedOption={residentKeyRequirement}
          handleResidentKeyRadioInputChange={handleResidentKeyRadioInputChange}
        />

        <AuthenticatorAttachmentRadio
          selectedOption={authenticatorAttachment}
          handleAuthenticatorAttachmentRadioInputChange={
            handleAuthenticatorAttachmentRadioInputChange
          }
        />
      </div>

      {isLoading && <span className="pl-2">Loading...</span>}
    </div>
  )
}
