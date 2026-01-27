import Link from 'next/link';

export function Hero() {
  return (
    <section className="hero-gradient min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p className="text-herd-cream/80 uppercase tracking-wider text-sm mb-4 font-medium">
              Planning Infrastructure for Food
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-shadow">
              Premium Beef at a Predictable Price
            </h1>
            <p className="text-xl text-herd-cream/90 mb-8 leading-relaxed">
              Direct from Texas ranchers to your kitchen. Lock in ribeye at the
              same price as ground beef—$5-6/lb flat rate across all cuts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/reserve"
                className="bg-white text-herd-green px-8 py-4 rounded-lg font-bold text-lg hover:bg-herd-cream text-center transition-colors"
              >
                Get Started
              </Link>
              <a
                href="#how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 text-center transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="aspect-[4/3] bg-gradient-to-br from-herd-green-light/30 to-herd-green-dark/30 rounded-xl flex items-center justify-center">
                <div className="text-center text-white/90">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-6xl font-bold">H</span>
                  </div>
                  <p className="text-lg font-medium">Texas Ranch Quality</p>
                  <p className="text-sm opacity-70">Direct to Your Kitchen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
