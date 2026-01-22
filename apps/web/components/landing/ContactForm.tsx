'use client';

import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ContactForm() {
  const contentRef = useScrollReveal();
  const formRef = useScrollReveal();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div ref={contentRef} className="reveal">
            <p className="text-herd-green uppercase tracking-wider text-sm mb-4 font-medium">
              Get Started
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Ready to Lock In Your Beef Supply?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Tell us about your organization and we&apos;ll put together a custom
              proposal.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-herd-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-herd-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <a
                    href="mailto:hello@herdsharecompany.com"
                    className="text-herd-green hover:underline"
                  >
                    hello@herdsharecompany.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-herd-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-herd-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Call Us</p>
                  <a
                    href="tel:+15125551234"
                    className="text-herd-green hover:underline"
                  >
                    (512) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div ref={formRef} className="bg-herd-cream rounded-2xl p-8 reveal">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-herd-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-herd-green focus:border-transparent outline-none"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-herd-green focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="org-type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Organization Type
                  </label>
                  <select
                    id="org-type"
                    name="organization_type"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-herd-green focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select one...</option>
                    <option value="fraternity">Fraternity / Greek Housing</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bbq">BBQ Operation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tell Us About Your Needs
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-herd-green focus:border-transparent outline-none resize-none"
                    placeholder="How many people do you feed?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-herd-green text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-herd-green-dark transition-colors disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
