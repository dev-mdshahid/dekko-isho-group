import { createBrowserRouter } from 'react-router-dom'
import { legacyRoutes } from './data/legacyRoutes'
import { LegacyRoutePage } from './pages/LegacyRoutePage'

const routes = legacyRoutes.map((route) => ({
  path: route.path,
  element: <LegacyRoutePage route={route} />,
}))

routes.push({
  path: '*',
  element: <LegacyRoutePage route={{ path: '*', file: '404.html', title: 'Page Not Found', layout: 'main' }} />,
})

export const router = createBrowserRouter(routes)
