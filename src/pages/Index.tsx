import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/components/sections/HomePage";
import SEOHead from "@/components/SEOHead";
import ContentSummary from "@/components/ContentSummary";

import ChatDiscovery from "@/components/ChatDiscovery";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import PersonSchema from "@/components/PersonSchema";
import ReviewSchema from "@/components/ReviewSchema";
import AggregateRatingSchema from "@/components/AggregateRatingSchema";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import IndividualReviewSchema from "@/components/IndividualReviewSchema";
import WebPageSchema from "@/components/WebPageSchema";
import OrganizationSchema from "@/components/OrganizationSchema";
import ServiceSchema from "@/components/ServiceSchema";
import FAQSchema from "@/components/FAQSchema";

const Index = () => {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "The Roundtable - Executive Decision Intelligence",
    provider: {
      "@type": "Organization",
      name: "Galavanteer",
    },
    description:
      "Cognitive infrastructure for founders and executives. AI-powered strategic thinking with 60+ expert personas that debate, disagree, and deliver actionable decisions.",
    serviceType: "Executive Intelligence Platform",
    areaServed: "Worldwide",
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEOHead
        title="The Roundtable | Your Judgment, Scaled | Galavanteer"
        description="Your best thinking doesn't scale. The Roundtable is cognitive infrastructure for founders and executives — 60+ expert personas debating your real decisions and delivering actionable outcomes."
        keywords="executive decision making, AI advisory board, strategic thinking, cognitive infrastructure, business intelligence, executive coaching, founder tools"
        canonicalUrl="https://galavanteer.com/"
        ogImage="https://galavanteer.com/social-images/boardroom-og.jpg"
        schemaData={homePageSchema}
        twitterLabel1="What It Is"
        twitterData1="Executive Intelligence"
        twitterLabel2="Expert Personas"
        twitterData2="60+"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }]} />
      <PersonSchema />
      <WebPageSchema />
      <OrganizationSchema />
      <ServiceSchema />
      <FAQSchema />
      <ReviewSchema />
      <LocalBusinessSchema />
      <AggregateRatingSchema
        itemName="The Roundtable by Galavanteer"
        itemType="Service"
        ratingValue="5.0"
        reviewCount="20"
        description="Executive decision intelligence platform with cognitive replication technology. Rated 5.0 stars by founders and executives."
        url="https://galavanteer.com"
      />
      <IndividualReviewSchema
        reviewerName="Private Equity Partner"
        reviewerTitle="Growth Equity Fund"
        rating={5}
        reviewBody="This isn't a cute AI demo—it's decision infrastructure. The Roundtable is the only system that understood the difference between generating text and generating judgment."
        datePublished="2025-01-25"
      />
      <IndividualReviewSchema
        reviewerName="Jason Ward"
        reviewerTitle="CEO & Founder"
        rating={5}
        reviewBody="It's actually me. Talking back to me. Jason built something that doesn't just respond—it reasons the way I do. My team uses it to make decisions when I'm not available."
        datePublished="2025-01-20"
      />
      <Header />
      <main role="main" id="main-content">
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Facts">
          <h2>Galavanteer Quick Facts</h2>
          <dl>
            <dt>Business Name</dt>
            <dd>Galavanteer</dd>

            <dt>Founded By</dt>
            <dd>Jason Baron</dd>

            <dt>Core Product</dt>
            <dd>The Roundtable - Executive Decision Intelligence</dd>

            <dt>What It Does</dt>
            <dd>AI-powered strategic advisory with 60+ expert personas that debate and deliver actionable decisions</dd>

            <dt>Three Levels</dt>
            <dd>
              Level 1: Identity (Brand Intelligence), Level 2: Operations (The Roundtable), Level 3: Mindset (Cognitive
              Replication)
            </dd>

            <dt>Key Differentiator</dt>
            <dd>Cognitive replication - AI that thinks and reasons like you, not generic chatbot responses</dd>

            <dt>Client Rating</dt>
            <dd>5.0 stars from executives, founders, and operators</dd>

            <dt>Contact Email</dt>
            <dd>jason@galavanteer.com</dd>

            <dt>Target Audience</dt>
            <dd>Founders, executives, private equity partners, non-profit leaders, coaches, and consultants</dd>
          </dl>
        </section>
        <ContentSummary
          title="The Roundtable - Executive Decision Intelligence"
          summary="The Roundtable is cognitive infrastructure for founders and executives. 60+ expert personas debate your real decisions and deliver actionable outcomes. Not a chatbot — a system that thinks like you."
          topics={[
            "Executive Intelligence",
            "Strategic Decision Making",
            "Cognitive Replication",
            "AI Advisory",
            "Founder Tools",
          ]}
          lastUpdated="2025-01-30"
        />
        <HomePage />
      </main>
      
      <Footer />
      <ChatDiscovery />
    </div>
  );
};

export default Index;
