import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu, X, Play, LogOut, Heart, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

import { SearchBar } from './SearchBar';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Watchlist', path: '/watchlist', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between',
        isScrolled ? 'bg-surface/90 backdrop-blur-md py-3 shadow-2xl' : 'bg-linear-to-b from-black/80 to-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-brand p-1 rounded-sm group-hover:scale-110 transition-transform">
            <Play className="fill-white text-white w-5 h-5" />
          </div>
          <span className="text-xl md:text-2xl font-display font-bold tracking-tighter text-brand">STREAMORA</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand',
                location.pathname === link.path ? 'text-brand' : 'text-gray-300'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <SearchBar />
        <Link 
          to="/notifications" 
          className="relative text-gray-300 hover:text-white transition-colors p-2 group"
        >
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full border-2 border-surface" />
        </Link>
        
        {/* Desktop User Profile */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-white">{user.name}</span>
                <button 
                  onClick={logout}
                  className="text-[10px] uppercase tracking-widest text-brand hover:underline"
                >
                  Logout
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center text-brand font-bold text-xs">
                {user.name[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-surface-light z-60 shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <span className="text-xl font-display font-bold tracking-tighter text-brand">MENU</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* User Section in Mobile Menu */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center text-brand font-bold text-lg">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-4">Sign in to sync your watchlist across devices</p>
                      <Link 
                        to="/login"
                        className="block w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand/90 transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-2 mb-4">Navigation</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-all",
                        location.pathname === link.path 
                          ? "bg-brand/10 text-brand" 
                          : "text-gray-300 hover:bg-white/5"
                      )}
                    >
                      {link.icon}
                      <span className="font-bold">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              {user && (
                <div className="p-6 border-t border-white/5">
                  <button 
                    onClick={logout}
                    className="flex items-center gap-4 w-full p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
