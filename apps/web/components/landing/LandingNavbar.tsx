'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LandingNavbarProps {
  userId?: string | null;
}

export function LandingNavbar({ userId }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-herd-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-herd-green font-bold text-xl hidden sm:block">
              HerdShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-herd-green transition-colors"
            >
              How It Works
            </a>
            <a
              href="#who-we-serve"
              className="text-gray-600 hover:text-herd-green transition-colors"
            >
              Who We Serve
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-herd-green transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-herd-green transition-colors"
            >
              About
            </a>
            {userId ? (
              <Link
                href="/dashboard"
                className="bg-herd-green text-white px-5 py-2 rounded-lg hover:bg-herd-green-dark font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <a
                href="#contact"
                className="bg-herd-green text-white px-5 py-2 rounded-lg hover:bg-herd-green-dark font-medium transition-colors"
              >
                Talk to Us
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="text-gray-600 py-2"
              >
                How It Works
              </a>
              <a
                href="#who-we-serve"
                onClick={closeMenu}
                className="text-gray-600 py-2"
              >
                Who We Serve
              </a>
              <a
                href="#pricing"
                onClick={closeMenu}
                className="text-gray-600 py-2"
              >
                Pricing
              </a>
              <a href="#about" onClick={closeMenu} className="text-gray-600 py-2">
                About
              </a>
              {userId ? (
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="bg-herd-green text-white px-5 py-2 rounded-lg text-center font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="bg-herd-green text-white px-5 py-2 rounded-lg text-center font-medium"
                >
                  Talk to Us
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
