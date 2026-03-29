import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopBtn from './components/ScrollToTopBtn/ScrollToTopBtn'
import Home from './pages/Home'
import Reservation from './pages/Reservation'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import BookingConfirmed from './pages/BookingConfirmed'
import PaymentCancelled from './pages/PaymentCancelled'
import OurStory from './pages/OurStory'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { ROUTES } from './utils/routes'

const R = ROUTES

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTopBtn />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Our Story — EN: /our-story  FR: /notre-histoire */}
        <Route path={R.en.ourStory} element={<OurStory />} />
        <Route path={R.fr.ourStory} element={<OurStory />} />

        {/* Profile — EN: /my-profile  FR: /mon-profil */}
        <Route path={R.en.profile} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={R.fr.profile} element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Login — EN: /login  FR: /connexion */}
        <Route path={R.en.login} element={<Login />} />
        <Route path={R.fr.login} element={<Login />} />

        {/* Booking confirmation — EN: /booking-confirmed  FR: /reservation-confirmee */}
        <Route path={R.en.bookingConfirmed} element={<BookingConfirmed />} />
        <Route path={R.fr.bookingConfirmed} element={<BookingConfirmed />} />

        {/* Payment cancelled — EN: /payment-cancelled  FR: /paiement-annule */}
        <Route path={R.en.paymentCancelled} element={<PaymentCancelled />} />
        <Route path={R.fr.paymentCancelled} element={<PaymentCancelled />} />

        {/* Legacy simple reservation form */}
        <Route path="/reservation-legacy" element={
          <ProtectedRoute><Reservation /></ProtectedRoute>
        } />

        {/* Booking wizard — EN: /booking  FR: /reservation */}
        <Route path={R.en.booking} element={
          <ProtectedRoute><Booking /></ProtectedRoute>
        } />
        <Route path={R.fr.booking} element={
          <ProtectedRoute><Booking /></ProtectedRoute>
        } />

        {/* Dashboard — EN: /my-space  FR: /mon-espace */}
        <Route path={R.en.dashboard} element={
          <ProtectedRoute noAdmin><Dashboard /></ProtectedRoute>
        } />
        <Route path={R.fr.dashboard} element={
          <ProtectedRoute noAdmin><Dashboard /></ProtectedRoute>
        } />

        {/* Admin — same in all languages */}
        <Route path={R.en.admin} element={
          <ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
