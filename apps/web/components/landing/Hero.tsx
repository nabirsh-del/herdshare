'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Hero() {
  const contentRef = useScrollReveal();

  return (
    <section className="min-h-screen flex items-center pt-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div ref={contentRef} className="text-center reveal">
          <p className="text-herd-green uppercase tracking-widest text-sm mb-6 font-medium">
            Direct from Texas Ranchers
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-8">
            Premium Beef at a
            <br />
            <span className="text-herd-green">Predictable Price</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Skip the middlemen. Lock in a flat rate across all cuts—ribeye to
            ground beef. Full traceability from ranch to table.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reserve"
              className="bg-herd-green text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-herd-green-dark transition-colors"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
