'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    title: 'We Place a Freezer',
    description: 'Commercial freezer installed at no cost to you.',
  },
  {
    number: '02',
    title: 'We Deliver Beef',
    description: 'Scheduled deliveries—approximately 475 lbs per steer.',
  },
  {
    number: '03',
    title: 'Serve Premium Beef',
    description: 'Steaks, roasts, and ground beef for 8+ weeks.',
  },
  {
    number: '04',
    title: 'Repeat',
    description: 'Lock in your rate for 3 years. No surprises.',
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
    <div ref={ref} className="reveal">
      <p className="text-5xl font-light text-herd-green/30 mb-4">{number}</p>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
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
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
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
