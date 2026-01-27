'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function About() {
  const contentRef = useScrollReveal();
  const valuesRef = useScrollReveal();

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={contentRef} className="reveal">
            <p className="text-herd-green uppercase tracking-widest text-sm mb-4 font-medium">
              About HerdShare
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
              American Beef.
              <br />
              American Values.
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              We&apos;re planning infrastructure for food—connecting independent
              Texas ranchers directly with institutions that feed people.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Every steer comes from a family ranch we know personally. Full
              traceability means you can tell your members or customers exactly
              where their beef came from.
            </p>
          </div>
          <div ref={valuesRef} className="reveal">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6">
                <p className="font-semibold text-gray-900 mb-1">100% Traceable</p>
                <p className="text-sm text-gray-500">Ranch to table</p>
              </div>
              <div className="p-6">
                <p className="font-semibold text-gray-900 mb-1">Texas Raised</p>
                <p className="text-sm text-gray-500">Local ranches</p>
              </div>
              <div className="p-6">
                <p className="font-semibold text-gray-900 mb-1">3-Year Pricing</p>
                <p className="text-sm text-gray-500">Locked rates</p>
              </div>
              <div className="p-6">
                <p className="font-semibold text-gray-900 mb-1">Family Owned</p>
                <p className="text-sm text-gray-500">Independent ranches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
