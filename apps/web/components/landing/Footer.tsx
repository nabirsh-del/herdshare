import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-herd-green-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-white font-bold text-xl">HerdShare</span>
            </div>
            <p className="text-herd-cream/70 mb-4">
              Planning infrastructure for food. Direct from Texas ranchers to
              your kitchen.
            </p>
            <p className="text-white font-display text-lg italic">
              &quot;American Beef. American Values.&quot;
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#how-it-works"
                  className="text-herd-cream/70 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#who-we-serve"
                  className="text-herd-cream/70 hover:text-white transition-colors"
                >
                  Who We Serve
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-herd-cream/70 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-herd-cream/70 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-herd-cream/70 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-herd-cream/70">
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
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-herd-cream/50 text-sm">
          <p>&copy; {new Date().getFullYear()} HerdShare Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
