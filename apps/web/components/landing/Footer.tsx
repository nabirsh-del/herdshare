import Link from 'next/link';
import { HerdShareLogo } from './HerdShareLogo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <HerdShareLogo className="w-10 h-10" color="#ffffff" />
              <span className="text-white font-semibold text-xl">HerdShare</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Planning infrastructure for food. Direct from Texas ranchers to
              your kitchen.
            </p>
            <p className="text-white text-lg">
              American Beef. American Values.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#who-we-serve"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Who We Serve
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="mailto:hello@herdsharecompany.com"
                  className="hover:text-white transition-colors"
                >
                  hello@herdsharecompany.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15125551234"
                  className="hover:text-white transition-colors"
                >
                  (512) 555-1234
                </a>
              </li>
              <li>Texas, USA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HerdShare Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
