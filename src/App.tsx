import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Watchlist } from './pages/Watchlist';
import { PersonDetails } from './pages/PersonDetails';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyEmail } from './pages/VerifyEmail';
import { ChangePassword } from './pages/ChangePassword';
import { Category } from './pages/Category';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-surface selection:bg-brand selection:text-white">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/person/:id" element={<PersonDetails />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/change-password" element={<ChangePassword />} />
                {/* Fallback to Home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AnimatePresence>
            
            <footer className="py-12 border-t border-white/5 bg-surface-light text-center">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-brand p-1 rounded-sm">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="text-xl font-display font-bold tracking-tighter text-brand">STREAMORA</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                © 2026 Streamora. All rights reserved. Cinematic streaming experience.
              </p>
              <div className="flex justify-center gap-8 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
