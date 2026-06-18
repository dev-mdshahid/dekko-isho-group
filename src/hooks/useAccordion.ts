import { useState } from 'react'

export function useAccordion(defaultIndex = 0) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultIndex)
  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }
  return { openIndex, toggle }
}
