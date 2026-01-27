'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function WhoWeServe() {
  const headerRef = useScrollReveal();
  const card1Ref = useScrollReveal();
  const card2Ref = useScrollReveal();

  return (
    <section id="who-we-serve" className="py-24 bg-herd-green">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Who We Serve
          </h2>
          <p className="text-white/70 text-lg max-w-xl">
            Built for institutions that feed people every day.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div ref={card1Ref} className="bg-white rounded-lg p-8 reveal">
            <p className="text-sm text-herd-green uppercase tracking-wider font-medium mb-2">Primary Focus</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fraternities & Greek Housing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You feed 50+ people every day. Lock in a flat rate and serve
              ribeye at ground beef prices.
            </p>
          </div>
          <div ref={card2Ref} className="bg-white rounded-lg p-8 reveal" style={{ transitionDelay: '100ms' }}>
            <p className="text-sm text-herd-green uppercase tracking-wider font-medium mb-2">Secondary Focus</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Restaurants & BBQ
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Stable pricing, full traceability, scheduled delivery. Plan your
              menu with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
