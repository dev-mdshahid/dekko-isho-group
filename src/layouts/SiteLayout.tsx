import type { PropsWithChildren } from 'react'
import { Footer } from '../components/layout/Footer'
import { MoreTemplates } from '../components/layout/MoreTemplates'
import { Navbar } from '../components/layout/Navbar'

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <MoreTemplates />
    </>
  )
}
