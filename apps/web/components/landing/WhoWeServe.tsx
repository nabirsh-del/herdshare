'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function WhoWeServe() {
  const headerRef = useScrollReveal();
  const card1Ref = useScrollReveal();
  const card2Ref = useScrollReveal();

  return (
    <section id="who-we-serve" className="py-24 bg-herd-green">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Who We Serve
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Built for institutions that feed people every day.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div ref={card1Ref} className="bg-white rounded-lg p-8 reveal hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
            <p className="text-herd-green text-sm font-medium uppercase tracking-wider mb-2">
              Primary Focus
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Fraternities & Greek Housing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Feed 50+ members daily. Flat rate, premium cuts.
            </p>
          </div>
          <div ref={card2Ref} className="bg-white rounded-lg p-8 reveal hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
            <p className="text-herd-green text-sm font-medium uppercase tracking-wider mb-2">
              Secondary Focus
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurants & BBQ
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Stable pricing. Full traceability. Scheduled delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
