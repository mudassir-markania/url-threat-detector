import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, Zap } from 'lucide-react'

// useLocation tells us what page we're currently on
// so we can highlight the active nav link

function Navbar() {
  const [isScrolled, setIsScrolled]   = useState(false)
  const [isMobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Listen to scroll — when user scrolls down, add a background to navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Home',        path: '/' },
    { label: 'Dashboard',   path: '/dashboard' },
    { label: 'URL Checker', path: '/check' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
        style={{
          background: isScrolled
            ? 'rgba(8, 11, 16, 0.95)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(255,255,255,0.06)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b6bff, #8b5cf6)' }}
              >
                <Shield size={16} className="text-white" />
              </div>
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #3b6bff, #8b5cf6)' }}
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Threat<span className="gradient-text">Lens</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
              >
                {/* Active indicator pill */}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(59, 107, 255, 0.15)', border: '1px solid rgba(59,107,255,0.3)' }}
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/check"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b6bff, #2554e8)' }}
            >
              <Zap size={14} />
              Check URL
            </Link>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 rounded-xl p-4"
            style={{
              background: 'rgba(15, 17, 23, 0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all"
                style={{
                  color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.6)',
                  background: isActive(link.path) ? 'rgba(59,107,255,0.15)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar