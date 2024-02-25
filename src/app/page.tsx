'use client'
import { ReactElement, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'

type AuthForms = 'login' | 'register'

type AuthFormData = {
  FormComponent: ReactElement
  headerTitle: string
  footerText: string
  footerButtonText: string
}

const AuthFormDataByType: Record<AuthForms, AuthFormData> = {
  login: {
    FormComponent: <LoginForm />,
    headerTitle: 'Log in',
    footerText: "Don't have an account yet?",
    footerButtonText: 'Create account',
  },
  register: {
    FormComponent: <RegisterForm />,
    headerTitle: 'Register',
    footerText: 'Already have an account?',
    footerButtonText: 'Log in',
  },
}

export default function Home() {
  const [currentAuthForm, setCurrentAuthForm] = useState<AuthForms>('login')

  const { FormComponent, headerTitle, footerButtonText, footerText } =
    AuthFormDataByType[currentAuthForm]

  const changeCurrentAuthForm = () => {
    setCurrentAuthForm(currentAuthForm === 'login' ? 'register' : 'login')
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-5 text-2xl">{headerTitle}</h1>

      {FormComponent}

      <div>
        <p className="text-xs">{footerText}</p>

        <button
          className="font-bold text-sky-500"
          onClick={changeCurrentAuthForm}
        >
          {footerButtonText}
        </button>
      </div>
    </div>
  )
}
