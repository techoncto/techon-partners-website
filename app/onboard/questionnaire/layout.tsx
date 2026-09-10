'use client'

import FormQuestionnaire from './FormQuestionnaire'

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FormQuestionnaire />
      {children}
    </>
  )
}
