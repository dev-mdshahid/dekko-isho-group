import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { legacyRoutes } from './data/legacyRoutes'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { LegacyRoutePage } from './pages/LegacyRoutePage'
import { PressDetailPage } from './pages/PressDetailPage'
import { PressPage } from './pages/PressPage'

const legacyRouteElements = legacyRoutes.map((route) => ({
  path: route.path,
  element: <LegacyRoutePage route={route} />,
}))

function LegacyBlogRedirect() {
  const { slug } = useParams()
  return <Navigate to={slug ? `/press/${slug}` : '/press'} replace />
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/press', element: <PressPage /> },
  { path: '/press/:slug', element: <PressDetailPage /> },
  { path: '/blog', element: <Navigate to="/press" replace /> },
  { path: '/blog/:slug', element: <LegacyBlogRedirect /> },
  ...legacyRouteElements,
  {
    path: '*',
    element: (
      <LegacyRoutePage
        route={{ path: '*', file: '404.html', title: 'Page Not Found', layout: 'main' }}
      />
    ),
  },
])
