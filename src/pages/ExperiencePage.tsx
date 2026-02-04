import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChatDiscovery from '@/components/ChatDiscovery';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ExperienceHero from '@/components/sections/ExperienceHero';
import EnhancedInteractiveExamplesSection from '@/components/sections/EnhancedInteractiveExamplesSection';
import JordanOSShowcase from '@/components/examples/JordanOSShowcase';
import ContactSection from '@/components/ContactSection';

const ExperiencePage = () => {
  return (
    <>
      <SEOHead 
        title="Experience Galavanteer AI Systems | See Real Personalized GPTs & AI Boardroom"
        description="See real AI systems in action. View actual transcripts from personalized GPTs and AI Boardroom demos. Discover how AI can amplify your unique voice with real client examples."
        canonicalUrl="https://galavanteer.com/experience"
        ogImage="https://galavanteer.com/social-images/experience-og.jpg"
        twitterLabel1="Features"
        twitterData1="Live demos & transcripts"
        twitterLabel2="Systems"
        twitterData2="Personalized GPTs"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Experience", url: "/experience" }
      ]} />
      <Header />
      <Breadcrumbs />
      <main>
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Experience Facts">
          <h2>Experience Galavanteer AI Systems</h2>
          <dl>
            <dt>What is the Experience Page?</dt>
            <dd>Interactive demonstrations of custom AI assistants and personalized GPT systems built by Galavanteer</dd>
            
            <dt>Featured Systems</dt>
            <dd>AI Boardroom, JordanOS, Custom Operating Systems, Voice-trained AI Assistants</dd>
            
            <dt>AI Boardroom</dt>
            <dd>Virtual advisory board with specialized AI advisors for strategic business decisions</dd>
            
            <dt>JordanOS</dt>
            <dd>Custom operating system built for Jordan Baron, demonstrates voice-matching and personalized AI capabilities</dd>
            
            <dt>Demo Format</dt>
            <dd>Live transcripts, interactive examples, real client systems</dd>
            
            <dt>What You'll See</dt>
            <dd>Actual AI responses in client voices, real workflow examples, time-saving demonstrations</dd>
            
            <dt>Technology</dt>
            <dd>Custom GPT systems built on OpenAI infrastructure with private hosting</dd>
            
            <dt>Next Steps</dt>
            <dd>Book a clarity session to discuss your AI strategy or explore pricing for custom development</dd>
          </dl>
        </section>
        <ExperienceHero />
        <EnhancedInteractiveExamplesSection />
        <JordanOSShowcase />
        <ContactSection />
      </main>
      <Footer />
      <MobileStickyCTA />
      <ChatDiscovery />
    </>
  );
};

export default ExperiencePage;