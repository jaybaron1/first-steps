import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatDiscovery from "@/components/ChatDiscovery";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import PersonSchema from "@/components/PersonSchema";
import { ArrowRight, Play, X } from "lucide-react";

const AboutPage = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "About Jason Baron - The Story Behind Galavanteer",
    author: {
      "@type": "Person",
      name: "Jason Baron",
      jobTitle: "Founder",
    },
    publisher: {
      "@type": "Organization",
      name: "Galavanteer",
    },
    datePublished: "2025-01-15",
    dateModified: "2025-02-10",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FDFBF7" }}>
      <SEOHead
        title="About Jason Baron - Galavanteer"
        description="The story of how Galavanteer evolved from a travel agency to building decision intelligence systems."
        keywords="Jason Baron, Galavanteer founder, decision intelligence"
        canonicalUrl="https://galavanteer.com/about"
        schemaData={articleSchema}
        pageType="article"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <PersonSchema />

      <Header />

      {/* Enhanced keyframes for premium animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drawLineGold {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-draw-line-gold {
          transform-origin: left;
          animation: drawLineGold 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>

      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Enhanced golden thread with subtle glow */}
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/40 to-gold/20"
              style={{
                boxShadow: "0 0 20px rgba(184, 149, 108, 0.15)",
              }}
            />
          </div>

          {/* Refined radial gradient */}
          <div
            className="absolute top-0 right-0 w-2/3 h-full opacity-[0.04]"
            style={{
              background: "radial-gradient(ellipse at 75% 15%, #B8956C 0%, transparent 55%)",
            }}
          />

          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          />

          <div className="container relative z-10 py-20">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Left: Name and Title */}
              <div className="lg:col-span-7 lg:pl-12">
                <div
                  className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div
                    className="w-12 h-px bg-gradient-to-r from-gold to-gold-light opacity-0 animate-draw-line-gold"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.15em] font-medium"
                    style={{ color: "#B8956C", letterSpacing: "0.15em" }}
                  >
                    The Founder
                  </span>
                </div>

                <h1 className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <span
                    className="block font-display font-light"
                    style={{
                      fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
                      lineHeight: 0.92,
                      color: "#1A1915",
                      letterSpacing: "-0.04em",
                      textRendering: "optimizeLegibility",
                    }}
                  >
                    Jason
                  </span>
                  <span
                    className="block font-display italic font-light"
                    style={{
                      fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
                      lineHeight: 0.92,
                      color: "#B8956C",
                      letterSpacing: "-0.04em",
                      textRendering: "optimizeLegibility",
                    }}
                  >
                    Baron
                  </span>
                </h1>

                <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <p className="text-[15px] max-w-md leading-loose mb-2" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                    I build systems that sit with you while you think.
                  </p>
                  <p
                    className="text-[15px] max-w-md leading-loose font-medium"
                    style={{ color: "#1A1915", lineHeight: 1.8 }}
                  >
                    This is the story of how that started.
                  </p>
                </div>

                {/* Enhanced Video CTA */}
                <button
                  onClick={() => setVideoOpen(true)}
                  className="group flex items-center gap-5 mt-10 transition-all duration-500 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div
                    className="relative w-16 h-16 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg"
                    style={{
                      background: "#1A1915",
                      boxShadow: "0 4px 20px rgba(26, 25, 21, 0.1)",
                    }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-px bg-gold/70 transition-all duration-500 group-hover:w-6" />
                    <div className="absolute top-0 left-0 w-px h-4 bg-gold/70 transition-all duration-500 group-hover:h-6" />
                    <div className="absolute bottom-0 right-0 w-4 h-px bg-gold/70 transition-all duration-500 group-hover:w-6" />
                    <div className="absolute bottom-0 right-0 w-px h-4 bg-gold/70 transition-all duration-500 group-hover:h-6" />
                    <Play size={20} style={{ color: "#D4B896" }} fill="#D4B896" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: "#7A7368" }}>
                      Watch
                    </p>
                    <p
                      className="text-sm font-medium transition-colors duration-300 group-hover:text-gold"
                      style={{ color: "#1A1915" }}
                    >
                      A word from Jason
                    </p>
                  </div>
                </button>
              </div>

              {/* Right: Photo with enhanced framing */}
              <div className="lg:col-span-5 relative">
                <div className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  {/* Decorative border with animation */}
                  <div
                    className="absolute -top-6 -left-6 w-full h-full border opacity-0 animate-fade-in-up"
                    style={{
                      borderColor: "rgba(184, 149, 108, 0.25)",
                      animationDelay: "0.7s",
                    }}
                  />

                  <div className="relative overflow-hidden" style={{ background: "#1A1915" }}>
                    <img
                      src="/lovable-uploads/jason-founder-new.jpeg"
                      alt="Jason Baron, Founder of Galavanteer"
                      className="w-full object-cover"
                      style={{ aspectRatio: "4/5" }}
                    />
                    {/* Enhanced gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(184, 149, 108, 0.3) 85%, rgba(184, 149, 108, 0.5) 100%)",
                      }}
                    />
                  </div>

                  {/* Enhanced title plate */}
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                    <div
                      className="px-8 py-3 backdrop-blur-sm relative"
                      style={{
                        background: "rgba(253, 251, 247, 0.95)",
                        boxShadow: "0 4px 24px rgba(26, 25, 21, 0.08)",
                      }}
                    >
                      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
                      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
                      <p className="text-[9px] uppercase tracking-[0.15em] font-medium" style={{ color: "#7A7368" }}>
                        Founder & Systems Architect
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Agency Background - Enhanced spacing and typography */}
        <section className="relative overflow-hidden" style={{ background: "#F9F6F0" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-28 lg:py-36">
            <div className="lg:pl-12 max-w-5xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#1A1915",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                We didn't set out to build an AI company.
              </h2>

              <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
                <div className="lg:col-span-7 space-y-8">
                  <p className="text-[17px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                    I was running a travel agency. The kind where mistakes don't get refunded and decisions stick.
                  </p>
                  <p className="text-[17px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                    When you plan something people may only do once in their lives, you learn fast that the thinking
                    before a decision matters more than the explanation after.
                  </p>

                  {/* Enhanced pull quote styling */}
                  <div className="relative pl-6 my-10">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/60 to-gold/20" />
                    <p
                      className="text-[17px] leading-loose font-medium tracking-wide"
                      style={{ color: "#1A1915", lineHeight: 1.9 }}
                    >
                      You slow down.
                      <br />
                      You test your assumptions.
                      <br />
                      You don't guess.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 flex items-center">
                  <p className="text-[17px] leading-loose" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                    I've spent most of my career in environments where small decisions compound quickly and the cost of
                    getting it wrong shows up later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Conference Table Story - Enhanced dark section */}
        <section className="relative overflow-hidden" style={{ background: "#1A1915" }}>
          {/* Enhanced golden thread for dark section */}
          <div
            className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20"
            style={{
              boxShadow: "0 0 20px rgba(184, 149, 108, 0.1)",
            }}
          />

          <div className="container py-28 lg:py-40">
            <div className="lg:pl-12 max-w-5xl mx-auto">
              {/* Enhanced section label */}
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-px bg-gradient-to-r from-gold/70 to-gold-light/50" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "#D4B896" }}>
                  The Moment
                </span>
              </div>

              <h2
                className="font-display font-light mb-20"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#FDFBF7",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                One afternoon at a conference, I sat down at a table with six strangers.
              </h2>

              <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 mb-20">
                <div className="space-y-8">
                  <p className="text-[17px] leading-loose" style={{ color: "#C9C3B8", lineHeight: 1.8 }}>
                    An actor. A producer. A physician's assistant. A life coach. A reverend. Different backgrounds.
                    Different pressures.
                  </p>
                  <p className="text-[17px] leading-loose" style={{ color: "#C9C3B8", lineHeight: 1.8 }}>
                    We started talking about AI. Not theory. Real use.
                  </p>
                  <p className="text-[17px] leading-loose" style={{ color: "#C9C3B8", lineHeight: 1.8 }}>
                    I pulled out my phone and quietly built something for each of them. No announcement. No pitch.
                  </p>
                </div>

                <div className="relative">
                  {/* Enhanced quote border */}
                  <div className="relative pl-10 border-l-2 border-gold/50">
                    <p className="text-sm leading-loose mb-8" style={{ color: "#A09A90", lineHeight: 1.8 }}>
                      Then I said
                    </p>
                    <p
                      className="font-display italic leading-tight mb-10"
                      style={{
                        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                        color: "#FDFBF7",
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      "Type in anything."
                    </p>
                    <p className="text-sm leading-loose" style={{ color: "#A09A90", lineHeight: 1.8 }}>
                      Someone typed: "What's one thing I need to say to myself that I don't know I need to say to
                      myself?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced emotional beat section */}
              <div className="relative py-16 my-16">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="text-center space-y-8 py-16">
                  <p
                    className="font-display text-xl lg:text-2xl tracking-wide"
                    style={{ color: "#C9C3B8", letterSpacing: "0.02em" }}
                  >
                    The table went quiet.
                  </p>
                  <p
                    className="font-display text-xl lg:text-2xl tracking-wide"
                    style={{ color: "#D4B896", letterSpacing: "0.02em" }}
                  >
                    Then emotional.
                  </p>
                  <p
                    className="font-display text-xl lg:text-2xl tracking-wide"
                    style={{ color: "#FDFBF7", letterSpacing: "0.02em" }}
                  >
                    Then honest.
                  </p>
                </div>
              </div>

              {/* Enhanced realization */}
              <div className="mt-20 text-center">
                <p
                  className="font-display italic font-light max-w-2xl mx-auto"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    color: "#FDFBF7",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  That's when it clicked for me.
                  <br />
                  This wasn't about technology.
                  <br />
                  <span style={{ color: "#D4B896" }}>It was about judgment.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Judgment and Decision-Making - Enhanced spacing */}
        <section className="relative overflow-hidden" style={{ background: "#FDFBF7" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-28 lg:py-36">
            <div className="lg:pl-12 max-w-4xl mx-auto">
              <div className="mb-20">
                <p className="text-[18px] leading-loose max-w-3xl" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                  Most people don't struggle because they lack information. They struggle because their decisions don't
                  get examined properly. They move forward with borrowed opinions, untested assumptions, or pressure
                  they haven't slowed down enough to name.
                </p>
              </div>

              {/* Enhanced do-forwards quote with refined decorative elements */}
              <div className="relative py-20 my-20">
                {/* Refined corner diamonds */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-br from-gold/50 to-gold/20" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-br from-gold/50 to-gold/20" />

                <blockquote className="text-center max-w-2xl mx-auto">
                  <p
                    className="font-display tracking-wide mb-3"
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                      color: "#1A1915",
                      letterSpacing: "0.01em",
                    }}
                  >
                    I don't believe in do-overs.
                  </p>
                  <p
                    className="font-display italic font-light"
                    style={{
                      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                      color: "#B8956C",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    I believe in do-forwards.
                  </p>
                </blockquote>
              </div>

              <p
                className="text-[17px] leading-loose text-center max-w-2xl mx-auto"
                style={{ color: "#5C554A", lineHeight: 1.8 }}
              >
                Once a decision is made, it shapes what comes next. So the thinking that leads up to it deserves more
                care than it usually gets.
              </p>
            </div>
          </div>
        </section>

        {/* What I Build Now - Enhanced hierarchy */}
        <section className="relative overflow-hidden" style={{ background: "#F9F6F0" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-28 lg:py-36">
            <div className="lg:pl-12 max-w-4xl">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-px bg-gradient-to-r from-gold/70 to-gold-light/50" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "#B8956C" }}>
                  The Work
                </span>
              </div>

              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#1A1915",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                What we build now is simple to describe and hard to fake.
              </h2>

              <div className="space-y-10 mb-16">
                <p className="text-[18px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                  We design systems that sit with you while you think.
                </p>

                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/40 to-transparent" />
                  <p className="text-[17px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.9 }}>
                    They don't tell you what to do.
                    <br />
                    They don't talk over you.
                    <br />
                    They make you explain yourself.
                  </p>
                </div>

                <p className="text-[17px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.9 }}>
                  They surface assumptions early.
                  <br />
                  They make tradeoffs explicit.
                  <br />
                  They slow you down when speed would cost you later.
                </p>
              </div>

              <div className="pt-12 border-t border-gold/15">
                <p className="text-[17px] leading-loose max-w-2xl" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                  From the outside, the work looks technical. In practice, the job is always the same: make decisions
                  clear before they become expensive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Galavanteer Exists - Enhanced dark closing */}
        <section className="relative overflow-hidden" style={{ background: "#1A1915" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20" />

          <div className="container py-28 lg:py-36">
            <div className="lg:pl-12 max-w-4xl mx-auto text-center">
              <p
                className="font-display font-light mb-12"
                style={{
                  fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                  color: "#FDFBF7",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                Galavanteer exists because we watched too many capable people carry decisions alone, then live with the
                consequences quietly.
              </p>

              {/* Enhanced decorative divider */}
              <div className="flex items-center justify-center gap-6 my-16">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold/40" />
                <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-gold/50 to-gold/20" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              <p className="text-[17px] leading-loose" style={{ color: "#C9C3B8", lineHeight: 1.8 }}>
                This started with a conversation at a table and it still works best that way.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="relative overflow-hidden" style={{ background: "#FDFBF7" }}>
          <div className="absolute left-8 lg:left-16 top-0 h-40 w-px bg-gradient-to-b from-gold/10 to-transparent" />

          <div className="container py-28 lg:py-32">
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="font-display font-light mb-10"
                style={{
                  color: "#1A1915",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                If you want to explore how this could support your thinking,
                <span className="block mt-3 italic" style={{ color: "#B8956C" }}>
                  We'd be glad to sit with you.
                </span>
              </h2>

              <a
                href="https://calendly.com/jason-galavanteer/discovery_call"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-500 group hover:shadow-lg"
                style={{
                  background: "#1A1915",
                  color: "#FDFBF7",
                }}
              >
                <span>Book a Clarity Call</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </a>

              <p className="mt-10 text-[10px] tracking-[0.12em] uppercase" style={{ color: "#7A7368" }}>
                30-minute call · No pitch · No pressure
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatDiscovery />

      {/* Enhanced Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: "rgba(26, 25, 21, 0.96)" }}
          onClick={() => setVideoOpen(false)}
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-8 right-8 p-3 transition-all duration-300 hover:scale-110"
            style={{ color: "#A09A90" }}
            aria-label="Close video"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            {/* Enhanced corner accents */}
            <div className="absolute -top-3 -left-3 w-10 h-px bg-gold/70" />
            <div className="absolute -top-3 -left-3 w-px h-10 bg-gold/70" />
            <div className="absolute -bottom-3 -right-3 w-10 h-px bg-gold/70" />
            <div className="absolute -bottom-3 -right-3 w-px h-10 bg-gold/70" />

            <div className="relative bg-black" style={{ paddingBottom: "125%" }}>
              <iframe
                src="https://www.instagram.com/p/DUTS3b-jQYf/embed"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
                title="Jason Baron - Galavanteer Introduction"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs tracking-wide" style={{ color: "#7A7368" }}>
                A word from the founder
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
