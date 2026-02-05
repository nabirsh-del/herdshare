'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Pricing() {
  const headerRef = useScrollReveal();
  const comparisonRef = useScrollReveal();
  const stat1Ref = useScrollReveal();
  const stat2Ref = useScrollReveal();
  const stat3Ref = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-20 reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Flat rate. All cuts. No hidden fees.
          </p>
        </div>

        <div ref={comparisonRef} className="max-w-3xl mx-auto mb-20 reveal">
          <div className="border border-gray-200 rounded-lg p-8 md:p-12 hover:shadow-lg hover:border-herd-green/30 transition-all duration-300">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <p className="text-gray-500 uppercase tracking-wider text-xs mb-2">
                  Grocery Store
                </p>
                <p className="text-3xl font-bold text-gray-400">
                  Variable
                </p>
                <p className="text-gray-400 text-sm mt-2">Changes weekly</p>
              </div>
              <div className="text-center hidden md:block">
                <p className="text-gray-300 text-sm">vs</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 uppercase tracking-wider text-xs mb-2">
                  HerdShare
                </p>
                <p className="text-3xl font-bold text-herd-green">
                  Flat Rate
                </p>
                <p className="text-herd-green text-sm mt-2">Locked for 3 years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div ref={stat1Ref} className="text-center reveal p-6 rounded-lg hover:-translate-y-1 hover:bg-gray-50 transition-all duration-300">
            <p className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">~475</p>
            <p className="text-gray-600">Pounds per steer</p>
          </div>
          <div ref={stat2Ref} className="text-center reveal p-6 rounded-lg hover:-translate-y-1 hover:bg-gray-50 transition-all duration-300">
            <p className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">8+</p>
            <p className="text-gray-600">Weeks of supply</p>
          </div>
          <div ref={stat3Ref} className="text-center reveal p-6 rounded-lg hover:-translate-y-1 hover:bg-gray-50 transition-all duration-300">
            <p className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">3</p>
            <p className="text-gray-600">Year price lock</p>
          </div>
        </div>
      </div>
    </section>
  );
}
