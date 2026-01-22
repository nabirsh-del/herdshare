'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export function About() {
  const contentRef = useScrollReveal();
  const cardRef = useScrollReveal();

  return (
    <section id="about" className="py-20 bg-herd-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="reveal">
            <p className="text-herd-green uppercase tracking-wider text-sm mb-4 font-medium">
              About HerdShare
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              American Beef. American Values.
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              We&apos;re planning infrastructure for food—connecting independent
              Texas ranchers directly with institutions that feed people.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Every steer comes from a family ranch we know personally. Full
              traceability means you can tell your members or customers exactly
              where their beef came from.
            </p>
          </div>
          <div ref={cardRef} className="bg-white rounded-2xl p-8 shadow-lg reveal">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-herd-cream rounded-xl">
                <p className="font-bold text-gray-800">100% Traceable</p>
                <p className="text-sm text-gray-500">Ranch to table</p>
              </div>
              <div className="text-center p-6 bg-herd-cream rounded-xl">
                <p className="font-bold text-gray-800">Texas Raised</p>
                <p className="text-sm text-gray-500">Local ranches</p>
              </div>
              <div className="text-center p-6 bg-herd-cream rounded-xl">
                <p className="font-bold text-gray-800">3-Year Pricing</p>
                <p className="text-sm text-gray-500">Locked rates</p>
              </div>
              <div className="text-center p-6 bg-herd-cream rounded-xl">
                <p className="font-bold text-gray-800">Family Owned</p>
                <p className="text-sm text-gray-500">Independent ranches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
