'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Pricing() {
  const headerRef = useScrollReveal();
  const comparisonRef = useScrollReveal();
  const stat1Ref = useScrollReveal();
  const stat2Ref = useScrollReveal();
  const stat3Ref = useScrollReveal();

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-herd-green mb-4">
            The Numbers Don&apos;t Lie
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Premium beef at a fraction of retail prices.
          </p>
        </div>

        <div ref={comparisonRef} className="max-w-4xl mx-auto mb-16 reveal">
          <div className="bg-herd-cream rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">
                  Grocery Store Ribeye
                </p>
                <p className="font-display text-5xl font-bold text-red-500">
                  $18<span className="text-2xl">/lb</span>
                </p>
                <p className="text-gray-500 mt-2">And rising</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-herd-green rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-lg">VS</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">
                  HerdShare (All Cuts)
                </p>
                <p className="font-display text-5xl font-bold text-herd-green">
                  $5.50<span className="text-2xl">/lb</span>
                </p>
                <p className="text-herd-green font-medium mt-2">
                  Locked for 3 years
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div ref={stat1Ref} className="text-center p-8 bg-herd-cream rounded-2xl reveal">
            <p className="font-display text-5xl font-bold text-herd-green mb-2">
              ~475
            </p>
            <p className="text-gray-600 text-lg">Pounds per steer</p>
          </div>
          <div ref={stat2Ref} className="text-center p-8 bg-herd-cream rounded-2xl reveal">
            <p className="font-display text-5xl font-bold text-herd-green mb-2">
              ~$2,500
            </p>
            <p className="text-gray-600 text-lg">Per delivery</p>
          </div>
          <div ref={stat3Ref} className="text-center p-8 bg-herd-cream rounded-2xl reveal">
            <p className="font-display text-5xl font-bold text-herd-green mb-2">
              8+
            </p>
            <p className="text-gray-600 text-lg">Weeks of supply</p>
          </div>
        </div>
      </div>
    </section>
  );
}
