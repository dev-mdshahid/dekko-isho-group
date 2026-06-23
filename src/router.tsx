import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom'
import { ScrollToTop } from './components/common/ScrollToTop'
import { AboutPage } from './pages/AboutPage'
import { AgamiFashionsPage } from './pages/AgamiFashionsPage'
import { AgamiWashingPage } from './pages/AgamiWashingPage'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { IshoLtdPage } from './pages/IshoLtdPage'
import { IzakayaPage } from './pages/IzakayaPage'
import { KlubhausPage } from './pages/KlubhausPage'
import { AwardsPage } from './pages/AwardsPage'
import { CareerPage } from './pages/CareerPage'
import { DekkoIshoPage } from './pages/DekkoIshoPage'
import { DekkoFashionsPage } from './pages/DekkoFashionsPage'
import { DekkoGarmentsPage } from './pages/DekkoGarmentsPage'
import { DekkoReadywaresPage } from './pages/DekkoReadywaresPage'
import { GlobusGarmentsPage } from './pages/GlobusGarmentsPage'
import { SustainabilityPage } from './pages/SustainabilityPage'
import { PressDetailPage } from './pages/PressDetailPage'
import { PressPage } from './pages/PressPage'
import { RoxyPaintsPage } from './pages/RoxyPaintsPage'
import { SolutionPage } from './pages/SolutionPage'
import { SprintexPage } from './pages/SprintexPage'
import { NotFoundPage } from './pages/NotFoundPage'

function BlogRedirect() {
  const { slug } = useParams()
  return <Navigate to={slug ? `/press/${slug}` : '/press'} replace />
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/gallery', element: <GalleryPage /> },
      { path: '/press', element: <PressPage /> },
      { path: '/press/:slug', element: <PressDetailPage /> },
      { path: '/awards', element: <AwardsPage /> },
      { path: '/career', element: <CareerPage /> },
      { path: '/sustainability', element: <SustainabilityPage /> },
      { path: '/solutions/:slug', element: <SolutionPage /> },
      { path: '/dekko-isho', element: <DekkoIshoPage /> },
      { path: '/dekko-garments', element: <DekkoGarmentsPage /> },
      { path: '/dekko-readywares', element: <DekkoReadywaresPage /> },
      { path: '/dekko-fashions', element: <DekkoFashionsPage /> },
      { path: '/globus-garments', element: <GlobusGarmentsPage /> },
      { path: '/agami-fashions', element: <AgamiFashionsPage /> },
      { path: '/agami-washing', element: <AgamiWashingPage /> },
      { path: '/isho-ltd', element: <IshoLtdPage /> },
      { path: '/klubhaus', element: <KlubhausPage /> },
      { path: '/izakaya', element: <IzakayaPage /> },
      { path: '/roxy-paints', element: <RoxyPaintsPage /> },
      { path: '/sprintex', element: <SprintexPage /> },
      { path: '/blog', element: <Navigate to="/press" replace /> },
      { path: '/blog/:slug', element: <BlogRedirect /> },
      { path: '/404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
