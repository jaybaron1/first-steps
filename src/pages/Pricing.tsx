
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/sections/PricingSection";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSummary from "@/components/ContentSummary";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import ChatDiscovery from '@/components/ChatDiscovery';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import AggregateRatingSchema from '@/components/AggregateRatingSchema';

const Pricing = () => {
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom AI Assistant Development Services",
    "provider": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Custom GPT Build",
        "price": "999",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Custom AI assistant built in your voice and style - includes 30-day tuning period"
      },
      {
        "@type": "Offer", 
        "name": "AI Advisory Team",
        "price": "3499",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Strategic AI advisory board for business decisions and planning"
      },
      {
        "@type": "Offer",
        "name": "1:1 Clarity Session",
        "price": "100",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "100",
          "priceCurrency": "USD",
          "unitText": "per hour"
        },
        "description": "System strategy consultation and workflow design"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead 
        title="Pricing Plans - Custom AI Assistant Development | Galavanteer"
        description="Transparent pricing for custom AI assistants and strategic advisory. Custom GPT Build from $999, AI Advisory Team from $3,499. Includes 30-day tuning period."
        keywords="custom GPT pricing, AI assistant cost, custom AI development pricing, ChatGPT customization price, AI consulting rates"
        canonicalUrl="https://galavanteer.com/pricing"
        ogImage="https://galavanteer.com/social-images/pricing-og.jpg"
        schemaData={pricingSchema}
        pageType="product"
        productPrice="999"
        productCurrency="USD"
        twitterLabel1="Starting Price"
        twitterData1="$999"
        twitterLabel2="Includes"
        twitterData2="30-day tuning period"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Pricing", url: "/pricing" }
      ]} />
      <AggregateRatingSchema 
        itemName="Custom GPT Build"
        itemType="Service"
        ratingValue="5.0"
        reviewCount="15"
        description="Custom AI assistant built in your voice and style - includes 30-day tuning period. Starting at $999."
        url="https://galavanteer.com/pricing"
      />
      <Header />
      <Breadcrumbs />
      <main className="flex-1" role="main">
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Pricing Facts">
          <h2>Galavanteer Pricing Information</h2>
          <dl>
            <dt>Custom GPT Build</dt>
            <dd>Starting at $999</dd>
            
            <dt>What's Included in $999</dt>
            <dd>1-2 hour discovery session, 3-10 days build time, 30-day tuning period, private AI system link, usage documentation</dd>
            
            <dt>AI Advisory Team</dt>
            <dd>Starting at $3,499+</dd>
            
            <dt>1:1 Clarity Session</dt>
            <dd>$100 per hour</dd>
            
            <dt>Basic Support Plan</dt>
            <dd>$50 per month - includes hosting, maintenance, 1 monthly refinement session, email support</dd>
            
            <dt>Pro Support Plan</dt>
            <dd>$150 per month - includes priority support, 2 monthly refinement sessions, strategic tuning</dd>
            
            <dt>Additional Development</dt>
            <dd>$100 per hour</dd>
            
            <dt>Payment Terms</dt>
            <dd>One-time build fee, no forced subscriptions</dd>
            
            <dt>Delivery Timeline</dt>
            <dd>Most clients have working system within 2 weeks</dd>
            
            <dt>Money-Back Guarantee</dt>
            <dd>30-day refinement period included to ensure satisfaction</dd>
            
            <dt>Technical Requirements</dt>
            <dd>None - works via simple web link like clicking a website</dd>
            
            <dt>Booking Link</dt>
            <dd>https://calendly.com/jason-galavanteer/discovery_call</dd>
          </dl>
        </section>
        <div className="py-12 md:py-16 bg-gradient-to-br from-white to-galavanteer-purple-light/20">
          <div className="container max-w-4xl">
            <ContentSummary 
              title="Custom AI Assistant Development Pricing"
              summary="Transparent pricing for custom AI assistants and strategic advisory. Custom GPT Build starts at $999 (includes 30-day tuning), AI Advisory Team from $3,499, with ongoing support options available."
              topics={["Custom GPT Pricing", "AI Development Costs", "Clarity Sessions", "Ongoing Support Plans", "Transparent Pricing"]}
              lastUpdated="2025-10-23"
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Pricing Plans</h1>
            <p className="text-lg text-center text-galavanteer-gray/80 max-w-2xl mx-auto mb-4">
              Galavanteer builds systems that think with you – not for you. 
              Choose the plan that matches your vision.
            </p>
            <p className="text-center text-galavanteer-gray/80 max-w-2xl mx-auto">
              Want to <a href="/examples" className="text-galavanteer-purple hover:underline font-medium">see real client results and case studies</a> before committing? Or prefer to start with a <a href="/clarity" className="text-galavanteer-purple hover:underline font-medium">1:1 clarity session to explore your AI strategy</a>?
            </p>

          </div>
        </div>
        <PricingSection />
        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 p-3">
          <div className="container flex items-center justify-between gap-3">
            <div className="text-sm">
              <div className="font-semibold text-galavanteer-gray">Build My Custom GPT</div>
              <div className="text-galavanteer-gray/70">From $999 • 30‑day tuning included</div>
            </div>
            <a href="https://calendly.com/jason-galavanteer/discovery_call" className="btn-primary whitespace-nowrap">Book a Clarity Call</a>
          </div>
        </div>
      </main>
      <Footer />
      <ChatDiscovery />
    </div>
  );
};

export default Pricing;
