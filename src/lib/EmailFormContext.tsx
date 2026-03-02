'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type EmailFormContextValue = {
  hasEmailValue: boolean
  setHasEmailValue: (value: boolean) => void
}

const EmailFormContext = createContext<EmailFormContextValue | null>(null)

export function EmailFormProvider({ children }: { children: ReactNode }) {
  const [hasEmailValue, setHasEmailValue] = useState(false)
  return (
    <EmailFormContext.Provider value={{ hasEmailValue, setHasEmailValue }}>
      {children}
    </EmailFormContext.Provider>
  )
}

export function useEmailForm() {
  const ctx = useContext(EmailFormContext)
  return ctx
}
