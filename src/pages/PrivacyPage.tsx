
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import SEOHead from '@/components/SEOHead';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let closestSection = 0;
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const sectionIndex = parseInt(element.getAttribute('data-section') || '0', 10);
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionCenter = sectionTop + rect.height / 2;
        const distance = Math.abs(scrollPosition - sectionCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = sectionIndex;
        }
      });

      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Privacy Policy - Galavanteer | Data Protection & AI Usage"
        description="Learn how Galavanteer protects your personal information and maintains privacy for custom AI assistants. Transparent data handling practices."
        keywords="privacy policy, data protection, AI privacy, custom GPT privacy, data security"
        canonicalUrl="https://galavanteer.com/privacy"
        ogImage="https://galavanteer.com/social-images/homepage-og.jpg"
        pageType="article"
        articlePublishedTime="2025-04-27T00:00:00Z"
        articleModifiedTime="2025-04-27T00:00:00Z"
        articleAuthor="Jason Baron"
        articleTags={["Privacy Policy", "Data Protection", "AI Privacy", "Security"]}
        twitterLabel1="Last Updated"
        twitterData1="April 27, 2025"
        twitterLabel2="Type"
        twitterData2="Legal Document"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" }
      ]} />
      <Header />
      <main className="flex-1" style={{ background: '#1A1915' }}>
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Privacy Policy Facts">
          <h2>Galavanteer Privacy Policy Summary</h2>
          <dl>
            <dt>Last Updated</dt>
            <dd>April 27, 2025</dd>
            <dt>What Information We Collect</dt>
            <dd>Name, email address, and information you voluntarily provide through forms and service bookings</dd>
            <dt>How We Use Information</dt>
            <dd>To deliver services, respond to inquiries, manage bookings and projects, send updates and service communications</dd>
            <dt>Custom GPT Privacy</dt>
            <dd>Materials provided for GPT development are used solely for system creation. After delivery via private link, Galavanteer cannot access your future conversations or data. All interactions remain within your individual session.</dd>
            <dt>GPT Link Sharing</dt>
            <dd>You control whether to share your GPT link with others. GPTs are not publicly listed unless authorized by you.</dd>
            <dt>User Responsibility</dt>
            <dd>AI outputs are generated algorithmically. Galavanteer is not responsible for accuracy or consequences of AI outputs. Use of outputs is at your discretion and risk.</dd>
            <dt>Data Security</dt>
            <dd>Reasonable measures taken to protect your information</dd>
            <dt>Third-Party Links</dt>
            <dd>Not responsible for privacy practices of external sites</dd>
            <dt>Policy Updates</dt>
            <dd>May be updated from time to time, check this page for changes</dd>
            <dt>Contact for Privacy Questions</dt>
            <dd>support@galavanteer.com</dd>
          </dl>
        </section>

        {/* Monumental Hero - Dark Editorial */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Dramatic radial gradient */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              background: 'radial-gradient(ellipse at 30% 40%, #B8956C 0%, transparent 50%)',
            }}
          />

          {/* Floating decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gold/50 to-transparent rotate-45" />
          <div className="absolute bottom-1/3 left-1/3 w-px h-24 bg-gradient-to-b from-gold/50 to-transparent -rotate-12" />

          <div className="container relative z-10 py-20">
            <div className="max-w-5xl mx-auto">
              {/* Masthead-style label */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="w-16 h-px bg-gold/30" />
                <span
                  className="text-[9px] uppercase tracking-[0.3em] font-medium"
                  style={{ color: '#7A7368' }}
                >
                  Legal Document
                </span>
                <div className="w-16 h-px bg-gold/30" />
              </div>

              {/* Monument Title */}
              <h1
                className="font-display text-center mb-8"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 9rem)',
                  lineHeight: 0.9,
                  color: '#FDFBF7',
                  letterSpacing: '-0.04em',
                  fontWeight: 400
                }}
              >
                Privacy
              </h1>

              {/* Subtle divider */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-1 h-1 rounded-full bg-gold/40" />
                <div className="w-24 h-px bg-gold/20" />
                <div className="w-1 h-1 rounded-full bg-gold/40" />
              </div>

              {/* Date stamp - editorial style */}
              <div className="text-center mb-16">
                <p
                  className="text-[10px] uppercase tracking-[0.25em] mb-2"
                  style={{ color: '#7A7368' }}
                >
                  Effective Date
                </p>
                <p
                  className="font-display text-sm"
                  style={{ color: '#D4B896' }}
                >
                  April 27, 2025
                </p>
              </div>

              {/* Statement of Intent */}
              <div className="max-w-2xl mx-auto text-center border-t border-b border-gold/10 py-12">
                <p
                  className="font-display italic leading-relaxed"
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    color: '#C9C3B8',
                    lineHeight: 1.6
                  }}
                >
                  Your data belongs to you.
                  <span className="block mt-3" style={{ color: '#FDFBF7' }}>
                    We protect it like our own.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent" />
            <span
              className="text-[9px] uppercase tracking-widest"
              style={{ color: '#A09A90' }}
            >
              Read Below
            </span>
          </div>
        </section>

        {/* Two-Column Layout - Magazine Editorial */}
        <section className="relative" style={{ background: '#FDFBF7' }}>
          <div className="container py-24 lg:py-32">
            <div className="max-w-6xl mx-auto">
              {/* Section Grid */}
              <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
                {/* Left Column - Section Numbers */}
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-24 space-y-8">
                    {['01', '02', '03', '04', '05', '06'].map((num, i) => (
                      <div key={i} className="flex items-center gap-4 transition-all duration-500">
                        <span
                          className="font-display text-2xl transition-colors duration-500"
                          style={{ color: i === activeSection ? '#B8956C' : '#D4D0C8' }}
                        >
                          {num}
                        </span>
                        <div
                          className="h-px flex-1 transition-all duration-500"
                          style={{ background: i === activeSection ? '#B8956C' : '#E8E6E0' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Content */}
                <div className="lg:col-span-10 space-y-24">
                  {/* 01 - What We Collect */}
                  <article data-section="0">
                    <div className="mb-6">
                      <h2
                        className="font-display mb-3"
                        style={{
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: '#1A1915',
                          lineHeight: 1.1
                        }}
                      >
                        What We Collect
                      </h2>
                      <div className="w-12 h-px bg-gold" />
                    </div>
                    <div className="prose-custom">
                      <p className="text-base leading-relaxed mb-4" style={{ color: '#3D3830' }}>
                        We collect only what you choose to share:
                      </p>
                      <p className="text-sm leading-loose" style={{ color: '#5C554A' }}>
                        Name, email address, and any information you voluntarily provide through forms, bookings, or direct communication. Nothing is tracked without your knowledge.
                      </p>
                    </div>
                  </article>

                  {/* 02 - How We Use It */}
                  <article data-section="1">
                    <div className="mb-6">
                      <h2
                        className="font-display mb-3"
                        style={{
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: '#1A1915',
                          lineHeight: 1.1
                        }}
                      >
                        How We Use It
                      </h2>
                      <div className="w-12 h-px bg-gold" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { title: 'Service Delivery', desc: 'Build and refine your custom AI systems' },
                        { title: 'Communication', desc: 'Respond to inquiries and provide support' },
                        { title: 'Project Management', desc: 'Coordinate bookings and deliverables' },
                        { title: 'Updates', desc: 'Send relevant service communications' }
                      ].map((item, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute left-0 top-2 w-2 h-px bg-gold/60" />
                          <h3
                            className="text-sm font-medium mb-1"
                            style={{ color: '#1A1915' }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-xs leading-relaxed" style={{ color: '#7A7368' }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>

                  {/* 03 - Your GPT Privacy */}
                  <article data-section="2" className="border-l-2 border-gold/30 pl-8">
                    <div className="mb-6">
                      <h2
                        className="font-display mb-3"
                        style={{
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: '#1A1915',
                          lineHeight: 1.1
                        }}
                      >
                        Your GPT Privacy
                      </h2>
                      <div className="w-12 h-px bg-gold" />
                    </div>
                    <div className="space-y-6">
                      <div className="bg-cream/30 p-6 border border-gold/10">
                        <p
                          className="font-display text-lg leading-relaxed mb-3"
                          style={{ color: '#1A1915' }}
                        >
                          Once delivered, it's yours. Completely.
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                          Materials you provide during development are used solely to build your system. After delivery via private link, Galavanteer has zero access to your conversations, prompts, or data. Your interactions stay within your session.
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                        You control link sharing. Your GPT remains private unless you authorize otherwise. Persistent knowledge may require reuploads based on session behavior—a platform limitation, not a privacy concern.
                      </p>
                    </div>
                  </article>

                  {/* 04 - Your Responsibility */}
                  <article data-section="3">
                    <div className="mb-6">
                      <h2
                        className="font-display mb-3"
                        style={{
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: '#1A1915',
                          lineHeight: 1.1
                        }}
                      >
                        Your Responsibility
                      </h2>
                      <div className="w-12 h-px bg-gold" />
                    </div>
                    <div className="bg-ink text-cream p-8">
                      <p className="text-sm leading-loose mb-6" style={{ color: '#C9C3B8' }}>
                        By using Galavanteer's services:
                      </p>
                      <ul className="space-y-3">
                        {[
                          'AI outputs are algorithmically generated',
                          'Accuracy and consequences rest with the user',
                          'All usage is at your discretion and risk'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full mt-2 bg-gold/60 flex-shrink-0" />
                            <span className="text-sm leading-relaxed" style={{ color: '#FDFBF7' }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>

                  {/* 05 - Security & Links */}
                  <article data-section="4">
                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h2
                          className="font-display mb-4"
                          style={{
                            fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                            color: '#1A1915'
                          }}
                        >
                          Data Security
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                          We employ reasonable measures to protect your information.
                        </p>
                      </div>
                      <div>
                        <h2
                          className="font-display mb-4"
                          style={{
                            fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                            color: '#1A1915'
                          }}
                        >
                          Third-Party Links
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                          External sites maintain their own privacy practices—beyond our control.
                        </p>
                      </div>
                    </div>
                  </article>

                  {/* 06 - Updates */}
                  <article data-section="5" className="pb-12 border-b border-ink/10">
                    <div className="mb-6">
                      <h2
                        className="font-display mb-3"
                        style={{
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: '#1A1915',
                          lineHeight: 1.1
                        }}
                      >
                        Policy Updates
                      </h2>
                      <div className="w-12 h-px bg-gold" />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                      This document may evolve. Check back periodically. Continued use constitutes acceptance of changes.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer - Ink on Cream */}
        <section className="relative" style={{ background: '#1A1915' }}>
          <div className="container py-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-px bg-gold/30" />
                <span
                  className="text-[9px] uppercase tracking-[0.25em]"
                  style={{ color: '#A09A90' }}
                >
                  Questions
                </span>
                <div className="w-12 h-px bg-gold/30" />
              </div>

              <h2
                className="font-display mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#FDFBF7'
                }}
              >
                We're here to clarify.
              </h2>

              <p className="text-sm leading-relaxed mb-8" style={{ color: '#A09A90' }}>
                Privacy questions deserve direct answers.
              </p>

              <a
                href="mailto:support@galavanteer.com"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-medium tracking-wide uppercase transition-all duration-300 group border border-gold/30 hover:bg-gold hover:border-gold"
                style={{
                  color: '#D4B896'
                }}
              >
                <span className="group-hover:text-ink transition-colors">support@galavanteer.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
