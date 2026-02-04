
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import ChatDiscovery from '@/components/ChatDiscovery';
import SEOHead from '@/components/SEOHead';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import HowToSchema from '@/components/HowToSchema';
import AggregateRatingSchema from '@/components/AggregateRatingSchema';
import { ArrowRight, Clock, Users, BookOpen, Brain } from 'lucide-react';

const ClarityPage = () => {
  const claritySchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "1:1 Clarity Sessions",
    "provider": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions"
    },
    "description": "Personalized AI strategy and clarity sessions for founders, creatives, and professionals. $100/hour consultation.",
    "offers": {
      "@type": "Offer",
      "price": "100",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="1:1 Clarity Sessions - AI Strategy Consulting | Galavanteer"
        description="Get personalized AI strategy and clarity with focused 1-on-1 consulting. Perfect for founders and professionals exploring custom AI. $100/hour."
        keywords="AI consulting, custom GPT strategy, AI advisory, business automation consulting, 1-on-1 AI sessions"
        canonicalUrl="https://galavanteer.com/clarity"
        ogImage="https://galavanteer.com/social-images/clarity-og.jpg"
        schemaData={claritySchema}
        twitterLabel1="Session Price"
        twitterData1="$100/hour"
        twitterLabel2="Format"
        twitterData2="Video call"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Clarity Sessions", url: "/clarity" }
      ]} />
      <HowToSchema 
        name="How to Book a 1:1 Clarity Session"
        description="Simple steps to book your personalized AI strategy consultation with Galavanteer. Get clarity on your AI needs in just one hour."
        totalTime="PT1H"
        estimatedCost={{
          currency: "USD",
          value: "100"
        }}
        steps={[
          {
            name: "Visit the Booking Page",
            text: "Click the 'Book Your Session' button to access our Calendly scheduling system. You'll see all available time slots."
          },
          {
            name: "Choose Your Time Slot",
            text: "Select a convenient date and time from the available options. Sessions are held via video call for maximum flexibility."
          },
          {
            name: "Complete the Booking",
            text: "Fill in your contact details and any specific topics you'd like to discuss. Payment is processed securely through the booking system."
          },
          {
            name: "Prepare for Your Session",
            text: "Think about your AI goals, current workflows, and any specific challenges you want to address. You'll receive a confirmation email with the video call link."
          },
          {
            name: "Join Your Clarity Session",
            text: "At your scheduled time, join the video call to discuss your personalized AI strategy with Jason Baron. Get actionable insights tailored to your needs."
          }
        ]}
      />
      <AggregateRatingSchema 
        itemName="1:1 Clarity Sessions with Jason Baron"
        itemType="Service"
        ratingValue="5.0"
        reviewCount="12"
        description="Personalized AI strategy consultation. Get clarity on your AI needs in one focused hour. $100 per session."
        url="https://galavanteer.com/clarity"
      />
      <Header />
      <main className="flex-1">
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Clarity Session Facts">
          <h2>1:1 Clarity Sessions with Jason Baron</h2>
          <dl>
            <dt>What is a Clarity Session?</dt>
            <dd>One-on-one AI strategy consultation focused on your specific needs and goals</dd>
            
            <dt>Price</dt>
            <dd>$100 per hour</dd>
            
            <dt>Session Format</dt>
            <dd>Video call via Calendly booking system</dd>
            
            <dt>Who Leads Sessions</dt>
            <dd>Jason Baron, Founder of Galavanteer and AI Systems Developer</dd>
            
            <dt>What You Get</dt>
            <dd>Personalized AI system strategy, practical advice tailored to your needs, workflow optimization recommendations, no long-term commitment required</dd>
            
            <dt>Who It's For</dt>
            <dd>Founders exploring AI for leverage, creators refining creative workflows, operators seeking efficiency and scale, thought leaders seeking faster clarity</dd>
            
            <dt>Session Rating</dt>
            <dd>5.0 stars from 12 clients</dd>
            
            <dt>Booking Process</dt>
            <dd>Visit Calendly booking page, choose time slot, complete booking with payment, prepare discussion topics, join video call at scheduled time</dd>
            
            <dt>Important Note</dt>
            <dd>Clarity sessions are for strategy and advice only. Building a custom AI system requires separate engagement starting at $999</dd>
            
            <dt>Next Steps After Session</dt>
            <dd>Explore custom AI assistant pricing, see real client results, or book additional sessions as needed</dd>
            
            <dt>Booking Link</dt>
            <dd>https://calendly.com/jason-galavanteer/discovery_call</dd>
          </dl>
        </section>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white to-galavanteer-purple-light/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                1:1 Clarity Sessions
              </h1>
              <p className="text-xl mb-8 text-galavanteer-gray">
                Focused Insight. Practical Strategy. Personalized to You.
              </p>
            </div>
          </div>
        </section>

        {/* Offer Details */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-galavanteer-gray-light p-8 rounded-lg border border-galavanteer-purple/10 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-galavanteer-gray">Personal Clarity Session</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-galavanteer-purple">$100</div>
                    <div className="text-sm text-galavanteer-gray/70">per hour</div>
                  </div>
                </div>
                <p className="text-galavanteer-gray/90 mb-6">
                  These sessions are designed for clear, fast, customized thinking.
                  Perfect for founders, creatives, and professionals ready to explore AI systems without committing to a full build yet.
                </p>
                <Button 
                  variant="primary" 
                  href="https://calendly.com/jason-galavanteer/discovery_call"
                  className="w-full justify-center"
                >
                  Book Your Session <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>

              <h3 className="text-xl font-bold mb-4 text-galavanteer-gray">What You Get:</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-galavanteer-purple-light p-1 rounded-full mt-1">
                    <Brain size={16} className="text-galavanteer-purple" />
                  </div>
                  <span>Personalized AI system strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-galavanteer-purple-light p-1 rounded-full mt-1">
                    <BookOpen size={16} className="text-galavanteer-purple" />
                  </div>
                  <span>Practical advice tailored to your needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-galavanteer-purple-light p-1 rounded-full mt-1">
                    <Clock size={16} className="text-galavanteer-purple" />
                  </div>
                  <span>Reflection and refinement for your workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-galavanteer-purple-light p-1 rounded-full mt-1">
                    <Users size={16} className="text-galavanteer-purple" />
                  </div>
                  <span>Prepaid booking — no long-term commitment</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4 text-galavanteer-gray">Who It's For:</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="font-medium mb-1">Founders exploring AI for leverage</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="font-medium mb-1">Creators refining creative workflows</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="font-medium mb-1">Operators seeking efficiency and scale</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="font-medium mb-1">Thought leaders seeking faster clarity</p>
                </div>
              </div>

              <div className="bg-galavanteer-purple-light/30 p-6 rounded-lg border border-galavanteer-purple/10 mb-8">
                <h3 className="font-bold mb-2 text-galavanteer-purple">Important Note:</h3>
                <p className="text-galavanteer-gray/90">
                  These sessions are for strategy and clarity only. Building a custom GPT system requires a separate engagement. Ready to build? <a href="/pricing" className="text-galavanteer-purple hover:underline font-medium">Explore our custom AI assistant pricing and development options</a>. Want proof first? <a href="/examples" className="text-galavanteer-purple hover:underline font-medium">See real client results and time savings</a>.
                </p>
              </div>

              <div className="text-center">
                <Button 
                  variant="primary" 
                  href="https://calendly.com/jason-galavanteer/discovery_call"
                  className="justify-center"
                >
                  Book Your Session <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatDiscovery />
    </div>
  );
};

export default ClarityPage;
