'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ProblemSolution() {
  const headerRef = useScrollReveal();
  const problemRef = useScrollReveal();
  const solutionRef = useScrollReveal();

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            The Beef Industry Is Broken
          </h2>
          <p className="text-gray-600 text-lg max-w-xl">
            Four companies control 85% of beef processing. Prices are up 50%
            since 2020.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div ref={problemRef} className="reveal">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              The Problem
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="text-gray-400">—</span>
                <span><strong className="text-gray-900">Price volatility</strong>—beef costs change week to week</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400">—</span>
                <span><strong className="text-gray-900">No traceability</strong>—unknown beef sources</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400">—</span>
                <span><strong className="text-gray-900">Middleman markups</strong>—every step adds cost</span>
              </li>
            </ul>
          </div>
          <div ref={solutionRef} className="reveal" style={{ transitionDelay: '100ms' }}>
            <h3 className="text-xl font-semibold text-herd-green mb-6">
              The HerdShare Solution
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="text-herd-green">—</span>
                <span><strong className="text-gray-900">Locked pricing</strong>—flat rate for every cut</span>
              </li>
              <li className="flex gap-3">
                <span className="text-herd-green">—</span>
                <span><strong className="text-gray-900">Full traceability</strong>—know your ranch and rancher</span>
              </li>
              <li className="flex gap-3">
                <span className="text-herd-green">—</span>
                <span><strong className="text-gray-900">Direct connection</strong>—support American ranchers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
