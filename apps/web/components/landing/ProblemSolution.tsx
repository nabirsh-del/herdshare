'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ProblemSolution() {
  const headerRef = useScrollReveal();
  const problemRef = useScrollReveal();
  const solutionRef = useScrollReveal();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-20 reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            The Beef Industry Is Broken
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Four companies control 85% of beef processing. Prices are up 50%
            since 2020.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div ref={problemRef} className="reveal">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Problem
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">—</span>
                <span><strong className="text-gray-900">Price swings</strong> — costs change weekly</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">—</span>
                <span><strong className="text-gray-900">No traceability</strong> — unknown sources</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">—</span>
                <span><strong className="text-gray-900">Middlemen</strong> — markup at every step</span>
              </li>
            </ul>
          </div>
          <div ref={solutionRef} className="reveal">
            <h3 className="text-2xl font-bold text-herd-green mb-6">
              The HerdShare Solution
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-herd-green mr-3">—</span>
                <span><strong className="text-gray-900">Locked pricing</strong> — 3-year flat rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-herd-green mr-3">—</span>
                <span><strong className="text-gray-900">Full traceability</strong> — know your rancher</span>
              </li>
              <li className="flex items-start">
                <span className="text-herd-green mr-3">—</span>
                <span><strong className="text-gray-900">Direct</strong> — ranch to you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
