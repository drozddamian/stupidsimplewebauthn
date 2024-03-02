import { ChangeEvent } from 'react'
import { ResidentKeyRequirement as ResidentKeyRequirementType } from '@/types'

interface ResidentKeyRequirementProps {
  selectedOption: ResidentKeyRequirementType
  handleResidentKeyRadioInputChange: (
    // eslint-disable-next-line no-unused-vars
    event: ChangeEvent<HTMLInputElement>,
  ) => void
}

export const ResidentKeyRequirementRadio = (
  props: ResidentKeyRequirementProps,
) => {
  const { selectedOption, handleResidentKeyRadioInputChange } = props

  return (
    <div className="flex-col">
      <h4>Resident Key Requirement</h4>
      <div className="flex">
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptionsRequirement"
            id="inlineRadio4"
            value="discouraged"
            checked={selectedOption === 'discouraged'}
            onChange={handleResidentKeyRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio4"
          >
            discouraged
          </label>
        </div>

        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptionsRequirement"
            id="inlineRadio5"
            value="preferred"
            checked={selectedOption === 'preferred'}
            onChange={handleResidentKeyRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio5"
          >
            preferred
          </label>
        </div>

        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
          <input
            className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
            type="radio"
            name="inlineRadioOptionsRequirement"
            id="inlineRadio6"
            value="required"
            checked={selectedOption === 'required'}
            onChange={handleResidentKeyRadioInputChange}
          />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio6"
          >
            required
          </label>
        </div>
      </div>
    </div>
  )
}
