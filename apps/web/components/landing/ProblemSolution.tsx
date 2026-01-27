'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ProblemSolution() {
  const headerRef = useScrollReveal();
  const problemRef = useScrollReveal();
  const solutionRef = useScrollReveal();

  return (
    <section className="py-20 bg-herd-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-herd-green mb-4">
            The Beef Industry Is Broken
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Four companies control 85% of beef processing. Prices are up 50%
            since 2020.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div
            ref={problemRef}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-red-400 reveal"
          >
            <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">
              The Problem
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong>Price volatility</strong>—beef costs change week to week
              </li>
              <li>
                <strong>No traceability</strong>—unknown beef sources
              </li>
              <li>
                <strong>Middleman markups</strong>—every step adds cost
              </li>
            </ul>
          </div>
          <div
            ref={solutionRef}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-herd-green reveal"
          >
            <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">
              The HerdShare Solution
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong>Locked pricing</strong>—$5-6/lb flat rate for 3 years
              </li>
              <li>
                <strong>Full traceability</strong>—know your ranch and rancher
              </li>
              <li>
                <strong>Direct connection</strong>—support American ranchers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
