'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Hero() {
  const contentRef = useScrollReveal();

  return (
    <section className="min-h-screen flex items-center pt-20 bg-gradient-to-br from-herd-green via-herd-green to-herd-green-dark">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-32">
        <div ref={contentRef} className="text-center reveal">
          <p className="text-white/80 uppercase tracking-widest text-sm mb-8 font-medium">
            Direct from Texas Ranchers
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-10">
            Premium Beef at a
            <br />
            <span className="text-white">Predictable Price</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-16 max-w-xl mx-auto leading-relaxed font-medium">
            One flat rate. Every cut. Ranch to table traceability.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/reserve"
              className="bg-white text-herd-green px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/50 text-white px-8 py-4 rounded-lg font-medium text-lg hover:border-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
