'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function WhoWeServe() {
  const headerRef = useScrollReveal();
  const card1Ref = useScrollReveal();
  const card2Ref = useScrollReveal();

  return (
    <section id="who-we-serve" className="py-20 bg-herd-green">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Who We Serve
          </h2>
          <p className="text-herd-cream/80 text-lg max-w-2xl mx-auto">
            Built for institutions that feed people every day.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div ref={card1Ref} className="bg-white rounded-2xl p-8 card-hover reveal">
            <h3 className="font-display text-2xl font-bold text-herd-green mb-2">
              Fraternities & Greek Housing
            </h3>
            <p className="text-herd-green/70 font-medium mb-4">Primary Focus</p>
            <p className="text-gray-600 mb-6">
              You feed 50+ guys every day. Lock in beef at $5-6/lb and serve
              ribeye at ground beef prices.
            </p>
          </div>
          <div ref={card2Ref} className="bg-white rounded-2xl p-8 card-hover reveal">
            <h3 className="font-display text-2xl font-bold text-herd-green mb-2">
              Restaurants & BBQ
            </h3>
            <p className="text-herd-green/70 font-medium mb-4">Secondary Focus</p>
            <p className="text-gray-600 mb-6">
              Stable pricing, full traceability, scheduled delivery. Plan your
              menu with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
