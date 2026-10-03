import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SkeletonRows, UiProvider } from './components/ui'
import { SessionProvider, useSession } from './lib/session'
import { ForgotPasswordPage, LoginPage, NoAccessPage, SetPasswordPage } from './pages/Auth'

const DashboardPage = lazy(() => import('./pages/Dashboard'))
const CircularsPage = lazy(() => import('./pages/Circulars'))
const CircularEditorPage = lazy(() => import('./pages/CircularEditor'))
const CvBankPage = lazy(() => import('./pages/CvBank'))
const ApplicationPage = lazy(() => import('./pages/Application'))
const CandidatePage = lazy(() => import('./pages/Candidate'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const UsersPage = lazy(() => import('./pages/Users'))
const ActivityPage = lazy(() => import('./pages/Activity'))
const AccountPage = lazy(() => import('./pages/Account'))

function Loading() {
  return (
    <div className="page">
      <SkeletonRows rows={6} />
    </div>
  )
}

function Protected({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { status, can } = useSession()
  if (status === 'loading') return <Loading />
  if (status === 'signed-out') return <Navigate to="/login" replace />
  if (status === 'no-access') return <NoAccessPage />
  if (admin && !can('admin')) return <Navigate to="/" replace />
  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { status } = useSession()
  if (status === 'loading') return null
  if (status === 'signed-in') return <Navigate to="/" replace />
  return <>{children}</>
}

function Root() {
  return (
    <UiProvider>
      <SessionProvider>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </SessionProvider>
    </UiProvider>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<DashboardPage />} />
        <Route path="circulars" element={<CircularsPage />} />
        <Route path="circulars/new" element={<CircularEditorPage />} />
        <Route path="circulars/:id" element={<CircularEditorPage />} />
        <Route path="cv-bank" element={<CvBankPage />} />
        <Route path="applications/:id" element={<ApplicationPage />} />
        <Route path="candidates/:id" element={<CandidatePage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="settings" element={<Protected admin><SettingsPage /></Protected>} />
        <Route path="users" element={<Protected admin><UsersPage /></Protected>} />
        <Route path="activity" element={<Protected admin><ActivityPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Route>,
  ),
  { basename: '/hr/admin' },
)

export function App() {
  return <RouterProvider router={router} />
}
