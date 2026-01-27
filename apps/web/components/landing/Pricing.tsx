'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Pricing() {
  const headerRef = useScrollReveal();
  const valueRef = useScrollReveal();
  const statsRef = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Flat-Rate Pricing
          </h2>
          <p className="text-gray-600 text-lg max-w-xl">
            One price per pound for every cut. Ribeye, filet, ground beef—all the same rate.
          </p>
        </div>

        <div ref={valueRef} className="max-w-3xl mb-20 reveal">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Traditional Beef Buying
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gray-400">—</span>
                  <span>Prices change week to week</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400">—</span>
                  <span>Premium cuts cost significantly more</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400">—</span>
                  <span>Unpredictable food costs</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-herd-green mb-4">
                The HerdShare Way
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-herd-green">—</span>
                  <span>Locked pricing for the contract term</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-herd-green">—</span>
                  <span>Same flat rate across all cuts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-herd-green">—</span>
                  <span>Plan your budget with confidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div ref={statsRef} className="grid md:grid-cols-3 gap-12 reveal">
          <div>
            <p className="text-5xl font-semibold text-gray-900 mb-2">
              ~475
            </p>
            <p className="text-gray-600">Pounds per steer</p>
          </div>
          <div>
            <p className="text-5xl font-semibold text-gray-900 mb-2">
              8+
            </p>
            <p className="text-gray-600">Weeks of supply</p>
          </div>
          <div>
            <p className="text-5xl font-semibold text-gray-900 mb-2">
              100%
            </p>
            <p className="text-gray-600">Texas raised beef</p>
          </div>
        </div>
      </div>
    </section>
  );
}
