import { lazy, type PropsWithChildren, Suspense } from 'react'

const CareerJobsPage = lazy(() => import('./CareerJobsPage'))
const CareerJobPage = lazy(() => import('./CareerJobPage'))
const CareerApplyPage = lazy(() => import('./CareerApplyPage'))

function Lazy({ children }: PropsWithChildren) {
  return <Suspense fallback={<div className="careers-route-fallback" />}>{children}</Suspense>
}

export function CareerJobsRoute() {
  return (
    <Lazy>
      <CareerJobsPage />
    </Lazy>
  )
}

export function CareerJobRoute() {
  return (
    <Lazy>
      <CareerJobPage />
    </Lazy>
  )
}

export function CareerApplyRoute() {
  return (
    <Lazy>
      <CareerApplyPage />
    </Lazy>
  )
}
