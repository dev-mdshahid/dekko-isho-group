import type { PropsWithChildren } from 'react'

export function MainLayout({ children }: PropsWithChildren) {
  return <div className="legacy-layout-main">{children}</div>
}
