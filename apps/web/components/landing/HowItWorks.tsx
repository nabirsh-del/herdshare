'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    title: 'We Place a Freezer',
    description: 'Free commercial freezer installed.',
  },
  {
    number: '02',
    title: 'We Deliver Beef',
    description: '~475 lbs per steer, on schedule.',
  },
  {
    number: '03',
    title: 'Serve Premium Beef',
    description: '8+ weeks of steaks, roasts, ground.',
  },
  {
    number: '04',
    title: 'Repeat',
    description: 'Same rate for 3 years.',
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="reveal p-6 rounded-lg bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
      <p className="text-5xl font-light text-herd-green/30 mb-4">{number}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export function HowItWorks() {
  const headerRef = useScrollReveal();

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-20 reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            From Texas ranch to your kitchen in four simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
