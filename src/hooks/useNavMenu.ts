import { useState } from 'react'

export function useNavMenu() {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    toggleMenu: () => setIsOpen((v) => !v),
    closeMenu: () => setIsOpen(false),
  }
}
