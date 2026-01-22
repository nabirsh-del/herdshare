import {
  LandingNavbar,
  Hero,
  ProblemSolution,
  HowItWorks,
  WhoWeServe,
  Pricing,
  About,
  ContactForm,
  Footer,
} from '@/components/landing';

// Check if Clerk is configured
const CLERK_ENABLED = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

export default async function HomePage() {
  let userId: string | null = null;

  if (CLERK_ENABLED) {
    const { auth } = await import('@clerk/nextjs');
    const authResult = auth();
    userId = authResult.userId;
  }

  return (
    <div className="min-h-screen bg-white font-body">
      <LandingNavbar userId={userId} />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <WhoWeServe />
      <Pricing />
      <About />
      <ContactForm />
      <Footer />
    </div>
  );
}
