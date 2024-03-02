import { ChangeEvent } from 'react'
import { UserVerificationRequirement } from '@/types'

interface UserVerificationProps {
  selectedOption: UserVerificationRequirement
  handleUserVerificationRadioInputChange: (
    // eslint-disable-next-line no-unused-vars
    event: ChangeEvent<HTMLInputElement>,
  ) => void
}

export const UserVerification = (props: UserVerificationProps) => {
  const { selectedOption, handleUserVerificationRadioInputChange } = props

  return (
    <div className="flex-col">
      <h4>User Verification</h4>
      <div className="flex">
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="discouraged"
            checked={selectedOption === 'discouraged'}
            onChange={handleUserVerificationRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio1"
          >
            discouraged
          </label>
        </div>

        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="preferred"
            checked={selectedOption === 'preferred'}
            onChange={handleUserVerificationRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio2"
          >
            preferred
          </label>
        </div>

        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio3"
            value="required"
            checked={selectedOption === 'required'}
            onChange={handleUserVerificationRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio3"
          >
            required
          </label>
        </div>
      </div>
    </div>
  )
}
