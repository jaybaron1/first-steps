import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import ReframeSection from './ReframeSection';
import RevealSection from './RevealSection';
import ComparisonSection from './ComparisonSection';
import VideoTestimonialsSection from './VideoTestimonialsSection';
import TestimonialsSection from './TestimonialsSection';
import TiersSection from './TiersSection';
import CTASection from './CTASection';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const sectionId = (location.state as any).scrollTo as string;
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Replace state so scrolling does not happen again on back button
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <main>
      {/* Hook: Your best thinking doesn't scale */}
      <HeroSection />

      {/* Amplify: You've tried everything */}
      <ProblemSection />

      {/* Reframe: What if your judgment could exist without you? */}
      <ReframeSection />

      {/* Reveal: Introducing The Roundtable */}
      <RevealSection />

      {/* Show: ChatGPT vs Boardroom comparison */}
      <ComparisonSection />

      {/* Prove: Video testimonials */}
      <VideoTestimonialsSection />

      {/* Prove: Text testimonials */}
      <TestimonialsSection />

      {/* Structure: Three tiers */}
      <TiersSection />

      {/* Path: Final CTA */}
      <CTASection />
    </main>
  );
};

export default HomePage;
