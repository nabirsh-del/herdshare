'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: 1,
    title: 'We Place a Freezer',
    description: 'Commercial freezer installed at no cost to you.',
  },
  {
    number: 2,
    title: 'We Deliver Beef',
    description: 'Scheduled deliveries—approximately 475 lbs per steer.',
  },
  {
    number: 3,
    title: 'Serve Premium Beef',
    description: 'Steaks, roasts, and ground beef for 8+ weeks.',
  },
  {
    number: 4,
    title: 'Repeat',
    description: 'Lock in your rate for 3 years. No surprises.',
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="text-center card-hover bg-herd-cream rounded-2xl p-8 reveal">
      <div className="w-16 h-16 bg-herd-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export function HowItWorks() {
  const headerRef = useScrollReveal();

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-herd-green mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From Texas ranch to your kitchen in four simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
