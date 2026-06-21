import { createBrowserRouter } from 'react-router-dom'
import { legacyRoutes } from './data/legacyRoutes'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { LegacyRoutePage } from './pages/LegacyRoutePage'

const legacyRouteElements = legacyRoutes.map((route) => ({
  path: route.path,
  element: <LegacyRoutePage route={route} />,
}))

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
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
