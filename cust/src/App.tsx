import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './contexts/BookingContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { HotelDetail } from './pages/HotelDetail';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Profile } from './pages/Profile';
import { Bookings } from './pages/Bookings';
import { Support } from './pages/Support';
import { ListProperty } from './pages/ListProperty';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="flex min-h-screen w-full flex-col bg-canvas font-sans text-ink">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/list-your-property" element={<ListProperty />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>);

}