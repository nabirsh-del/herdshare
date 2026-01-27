import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="min-h-screen flex items-end pt-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-2xl">
          <p className="text-white/80 uppercase tracking-wider text-sm mb-4 font-medium">
            Planning Infrastructure for Food
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6 text-white">
            Premium Beef at a Predictable Price
          </h1>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Direct from Texas ranchers to your kitchen. Lock in premium cuts
            at a flat rate—ribeye at the same price as ground beef.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/reserve"
              className="bg-white text-herd-green px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 text-center transition-colors"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="border border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 text-center transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
