import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom'
import { ScrollToTop } from './components/common/ScrollToTop'
import { SmoothScroll } from './components/common/SmoothScroll'
import { SplashScreen } from './components/splash/SplashScreen'
import { SplashProvider } from './context/SplashContext'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { IshoLtdPage } from './pages/IshoLtdPage'
import { IzakayaPage } from './pages/IzakayaPage'
import { KlubhausPage } from './pages/KlubhausPage'
import { AwardsPage } from './pages/AwardsPage'
import { CareerPage } from './pages/CareerPage'
import { CareerApplyRoute, CareerJobRoute, CareerJobsRoute } from './pages/careers/CareerRoutes'
import { DekkoIshoPage } from './pages/DekkoIshoPage'
import { DekkoFashionsPage } from './pages/DekkoFashionsPage'
import { DekkoGarmentsPage } from './pages/DekkoGarmentsPage'
import { DekkoReadywaresPage } from './pages/DekkoReadywaresPage'
import { SustainabilityPage } from './pages/SustainabilityPage'
import { PressDetailPage } from './pages/PressDetailPage'
import { PressPage } from './pages/PressPage'
import { SolutionPage } from './pages/SolutionPage'
import { NotFoundPage } from './pages/NotFoundPage'
import NewsPage from './pages/NewsPage'
// import { AgamiFashionsPage } from './pages/AgamiFashionsPage'
// import { AgamiWashingPage } from './pages/AgamiWashingPage'
// import { GlobusGarmentsPage } from './pages/GlobusGarmentsPage'
// import { RoxyPaintsPage } from './pages/RoxyPaintsPage'
// import { SprintexPage } from './pages/SprintexPage'

function BlogRedirect() {
  const { slug } = useParams()
  return <Navigate to={slug ? `/press/${slug}` : '/press'} replace />
}

function RootLayout() {
  return (
    <SplashProvider>
      <SmoothScroll />
      <ScrollToTop />
      <SplashScreen />
      <Outlet />
    </SplashProvider>
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
      { path: '/news', element: <NewsPage /> },
      { path: '/press', element: <PressPage /> },
      { path: '/press/:slug', element: <PressDetailPage /> },
      { path: '/awards', element: <AwardsPage /> },
      { path: '/career', element: <CareerPage /> },
      { path: '/career/jobs', element: <CareerJobsRoute /> },
      { path: '/career/jobs/:slug', element: <CareerJobRoute /> },
      { path: '/career/apply', element: <CareerApplyRoute /> },
      { path: '/sustainability', element: <SustainabilityPage /> },
      { path: '/solutions/:slug', element: <SolutionPage /> },
      { path: '/dekko-isho', element: <DekkoIshoPage /> },
      { path: '/dekko-garments', element: <DekkoGarmentsPage /> },
      { path: '/dekko-readywares', element: <DekkoReadywaresPage /> },
      { path: '/dekko-fashions', element: <DekkoFashionsPage /> },
      { path: '/isho-ltd', element: <IshoLtdPage /> },
      { path: '/klubhaus', element: <KlubhausPage /> },
      { path: '/izakaya', element: <IzakayaPage /> },
      { path: '/blog', element: <Navigate to="/press" replace /> },
      { path: '/blog/:slug', element: <BlogRedirect /> },
      { path: '/404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
      // { path: '/globus-garments', element: <GlobusGarmentsPage /> },
      // { path: '/agami-fashions', element: <AgamiFashionsPage /> },
      // { path: '/agami-washing', element: <AgamiWashingPage /> },
      // { path: '/roxy-paints', element: <RoxyPaintsPage /> },
      // { path: '/sprintex', element: <SprintexPage /> },
    ],
  },
])
