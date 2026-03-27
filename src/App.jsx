import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopBtn from './components/ScrollToTopBtn/ScrollToTopBtn'
import Home from './pages/Home'
import Reservation from './pages/Reservation'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import BookingConfirmed from './pages/BookingConfirmed'
import PaymentCancelled from './pages/PaymentCancelled'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTopBtn />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/reservation-confirmee" element={<BookingConfirmed />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/paiement-annule" element={<PaymentCancelled />} />
        <Route path="/reservation" element={
          <ProtectedRoute>
            <Reservation />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
