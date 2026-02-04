import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExamplesHero from "@/components/examples/ExamplesHero";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSummary from "@/components/ContentSummary";
import StructuredData from "@/components/StructuredData";
import CaseStudiesSection from "@/components/examples/CaseStudiesSection";
import ChatDiscovery from '@/components/ChatDiscovery';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ReviewSchema from '@/components/ReviewSchema';
import IndividualReviewSchema from '@/components/IndividualReviewSchema';
const Examples = () => {
  const examplesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI System Examples and Case Studies",
    "description": "Real-world examples of custom GPT implementations and AI systems built by Galavanteer",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [{
        "@type": "SoftwareApplication",
        "name": "Custom Operating System Assistant",
        "applicationCategory": "BusinessApplication",
        "description": "Personalized system that matches your voice and workflow"
      }, {
        "@type": "SoftwareApplication",
        "name": "Advisory Board",
        "applicationCategory": "BusinessApplication",
        "description": "Virtual board of advisors for strategic business decisions"
      }]
    }
  };
  return <>
      <SEOHead title="Real Wins - Client Results & Case Studies | Galavanteer" description="See real client results from custom AI assistants built by Galavanteer. Time savings and concrete outcomes from voice-trained systems." keywords="client results, AI assistant outcomes, case studies, time savings, custom GPT results, productivity gains" canonicalUrl="https://galavanteer.com/examples" ogImage="https://galavanteer.com/social-images/examples-og.jpg" schemaData={examplesSchema} twitterLabel1="Client Rating" twitterData1="5.0 stars" twitterLabel2="Time Saved" twitterData2="5+ hours/week" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Examples", url: "/examples" }
      ]} />
      <ReviewSchema />
      <IndividualReviewSchema 
        reviewerName="Brandon Gaydorus"
        reviewerTitle="Author, Founder & Speaker"
        rating={5}
        reviewBody="Working with Galavanteer to create our custom AI assistant has transformed how we approach content creation. The AI understands our voice and helps us maintain authenticity across all our work."
        datePublished="2025-02-01"
      />
      <IndividualReviewSchema 
        reviewerName="Carl Michel"
        reviewerTitle="Author, Founder & Speaker"
        rating={5}
        reviewBody="The custom GPT system from Galavanteer has been incredible for our creative process. It's like having a thinking partner that truly understands our style and message."
        datePublished="2025-02-01"
      />
      <IndividualReviewSchema 
        reviewerName="David Wood"
        reviewerTitle="Data Insights Analyst"
        rating={5}
        reviewBody="Jason didn't just answer questions — he equipped me with tools to solve them myself. His AI system helped me get up to speed in a completely new technical role 3x faster than traditional onboarding."
        datePublished="2025-01-25"
      />
      <IndividualReviewSchema 
        reviewerName="Celeste Moore"
        reviewerTitle="Luxury Image Strategist"
        rating={5}
        reviewBody="Honestly, I didn't know what a personalized chatbot was until Jason created one for me. I'm truly blown away not only by Jason but by what this system can do. Everyone needs one of these in their business."
        datePublished="2025-01-20"
      />
      <Header />
      <Breadcrumbs />
      <main className="flex-1 bg-gray-50 min-h-screen" role="main">
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Client Results">
          <h2>Galavanteer Client Results and Case Studies</h2>
          <dl>
            <dt>Overall Client Rating</dt>
            <dd>5.0 stars from 20+ clients</dd>
            
            <dt>Average Time Saved</dt>
            <dd>5+ hours per week</dd>
            
            <dt>Brandon Gaydorus - Author, Founder & Speaker</dt>
            <dd>Custom AI for content creation, maintains authentic voice across platforms, faster book and presentation drafting</dd>
            
            <dt>Carl Michel - Author, Founder & Speaker</dt>
            <dd>AI thinking partner for creative process, understands style and message</dd>
            
            <dt>David Wood - Data Insights Analyst</dt>
            <dd>Got up to speed 3x faster in new technical role, equipped with self-solving tools, reduced dependency on senior team</dd>
            
            <dt>Celeste Moore - Luxury Image Strategist</dt>
            <dd>Discovered new business use cases, streamlined client onboarding, consistent luxury brand voice</dd>
            
            <dt>Common Use Cases</dt>
            <dd>Content creation, email writing, client communication, strategic decision-making, meeting preparation, onboarding sequences</dd>
            
            <dt>Industries Served</dt>
            <dd>Authors, speakers, consultants, data analysts, luxury services, coaching, creative professionals</dd>
            
            <dt>Typical Client Profile</dt>
            <dd>Solo entrepreneurs, small teams, thought leaders, neurodivergent professionals</dd>
            
            <dt>Success Metrics</dt>
            <dd>Time savings, consistent brand voice, faster onboarding, reduced decision fatigue, improved content quality</dd>
            
            <dt>Video Testimonials</dt>
            <dd>Available on Instagram @galavanteer_ai and embedded on examples page</dd>
          </dl>
        </section>
        
        <ExamplesHero />
        <TestimonialsSection />
        <CaseStudiesSection />
        
        {/* Internal Linking Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-galavanteer-gray">Ready to Get Similar Results?</h2>
              <p className="text-lg text-galavanteer-gray/80 mb-6">
                Join clients who are saving 5+ hours per week with custom AI assistants trained in their unique voice and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/pricing" className="text-galavanteer-purple hover:underline font-medium text-lg">
                  Explore transparent pricing for custom AI development →
                </a>
                <span className="text-galavanteer-gray/60 hidden sm:inline">or</span>
                <a href="/clarity" className="text-galavanteer-purple hover:underline font-medium text-lg">
                  Book a 1:1 clarity session to discuss your AI strategy →
                </a>
              </div>
              <p className="mt-6 text-galavanteer-gray/70">
                Want to learn more? <a href="/about" className="text-galavanteer-purple hover:underline font-medium">Discover the story behind Galavanteer</a> and our voice-first AI method.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatDiscovery />
    </>;
};
export default Examples;