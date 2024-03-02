import { ChangeEvent } from 'react'
import { AuthenticatorAttachment } from '@/types'

interface AuthenticatorAttachmentRadioProps {
  selectedOption: AuthenticatorAttachment
  handleAuthenticatorAttachmentRadioInputChange: (
    // eslint-disable-next-line no-unused-vars
    event: ChangeEvent<HTMLInputElement>,
  ) => void
}

export const AuthenticatorAttachmentRadio = (
  props: AuthenticatorAttachmentRadioProps,
) => {
  const { selectedOption, handleAuthenticatorAttachmentRadioInputChange } =
    props

  return (
    <div className="flex-col">
      <h4>Authenticator Attachment</h4>

      <div className="flex">
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptionsAttachment"
            id="inlineRadio7"
            value="platform"
            checked={selectedOption === 'platform'}
            onChange={handleAuthenticatorAttachmentRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio7"
          >
            platform
          </label>
        </div>

        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptionsAttachment"
            id="inlineRadio8"
            value="cross-platform"
            checked={selectedOption === 'cross-platform'}
            onChange={handleAuthenticatorAttachmentRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio8"
          >
            cross-platform
          </label>
        </div>
      </div>
    </div>
  )
}
