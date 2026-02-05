'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Hero() {
  const contentRef = useScrollReveal();

  return (
    <section
      className="min-h-screen flex items-center pt-20 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`,
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div ref={contentRef} className="text-center reveal">
          <p className="text-white uppercase tracking-widest text-sm mb-6 font-medium">
            Direct from Texas Ranchers
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
            Premium Beef at a
            <br />
            <span className="text-white">Predictable Price</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Skip the middlemen. Lock in a flat rate across all cuts, from ribeye to ground beef. Full traceability from ranch to table.
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
              className="border border-white/70 text-white px-8 py-4 rounded-lg font-medium text-lg hover:border-white hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
