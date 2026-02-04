import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatDiscovery from '@/components/ChatDiscovery';
import SEOHead from '@/components/SEOHead';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import PersonSchema from '@/components/PersonSchema';
import { ArrowRight, Play, X } from 'lucide-react';

const AboutPage = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "About Galavanteer - The Story Behind Custom AI Development",
    "author": {
      "@type": "Person",
      "name": "Jason Baron",
      "jobTitle": "Founder & AI Systems Developer"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Galavanteer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-10-23",
    "description": "The story of how Galavanteer evolved from a travel agency to a leading custom AI development company."
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDFBF7' }}>
      <SEOHead
        title="About Galavanteer - Custom AI That Amplifies You | Jason Baron"
        description="Learn how Galavanteer creates custom AI assistants that amplify your unique voice and capabilities. The story of Jason Baron."
        keywords="Jason Baron, Galavanteer founder, custom AI development, AI consultant, voice-trained AI"
        canonicalUrl="https://galavanteer.com/about"
        schemaData={articleSchema}
        pageType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" }
      ]} />
      <PersonSchema />

      <Header />

      <main className="flex-1">
        {/* Hero Section — Editorial, Asymmetric */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* The Golden Thread */}
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-gold/10" />

          {/* Subtle background texture */}
          <div
            className="absolute top-0 right-0 w-2/3 h-full opacity-[0.03]"
            style={{
              background: 'radial-gradient(ellipse at 80% 20%, #B8956C 0%, transparent 50%)',
            }}
          />

          <div className="container relative z-10 py-20">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Name and Title */}
              <div className="lg:col-span-7 lg:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
                  <span className="label tracking-widest">The Founder</span>
                </div>

                <h1 className="mb-4">
                  <span
                    className="block font-display"
                    style={{
                      fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                      lineHeight: 0.95,
                      color: '#1A1915',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    Jason
                  </span>
                  <span
                    className="block font-display italic"
                    style={{
                      fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                      lineHeight: 0.95,
                      color: '#B8956C',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    Baron
                  </span>
                </h1>

                <p
                  className="text-sm max-w-md leading-relaxed mb-8"
                  style={{ color: '#5C554A' }}
                >
                  I build AI systems that think with you — not for you, not at you.
                  <span className="block mt-2" style={{ color: '#1A1915' }}>
                    This is the story of how that started.
                  </span>
                </p>

                {/* Video CTA */}
                <button
                  onClick={() => setVideoOpen(true)}
                  className="group flex items-center gap-4 transition-all duration-300"
                >
                  <div
                    className="relative w-14 h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{ background: '#1A1915' }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-px bg-gold/60" />
                    <div className="absolute top-0 left-0 w-px h-3 bg-gold/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-px bg-gold/60" />
                    <div className="absolute bottom-0 right-0 w-px h-3 bg-gold/60" />
                    <Play size={18} style={{ color: '#D4B896' }} fill="#D4B896" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#7A7368' }}>
                      Watch
                    </p>
                    <p className="text-sm font-medium" style={{ color: '#1A1915' }}>
                      A word from Jason
                    </p>
                  </div>
                </button>
              </div>

              {/* Right: Photo */}
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  {/* Decorative frame */}
                  <div
                    className="absolute -top-4 -left-4 w-full h-full"
                    style={{ border: '1px solid rgba(184, 149, 108, 0.3)' }}
                  />
                  <div
                    className="relative overflow-hidden"
                    style={{ background: '#1A1915' }}
                  >
                    <img
                      src="/lovable-uploads/jason-founder-new.jpeg"
                      alt="Jason Baron, Founder of Galavanteer"
                      className="w-full object-cover opacity-95"
                      style={{ aspectRatio: '4/5' }}
                    />
                    {/* Gold overlay gradient */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: 'linear-gradient(180deg, transparent 60%, rgba(184, 149, 108, 0.4) 100%)'
                      }}
                    />
                  </div>
                  {/* Caption */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                    <div
                      className="px-6 py-2"
                      style={{ background: '#FDFBF7' }}
                    >
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: '#7A7368' }}>
                        Founder & Systems Architect
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Origin Story */}
        <section className="relative overflow-hidden" style={{ background: '#1A1915' }}>
          {/* Golden Thread continues */}
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-20 lg:py-28">
            <div className="lg:pl-12 max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-px bg-gradient-to-r from-gold/60 to-transparent" />
                <span className="label" style={{ color: '#7A7368' }}>The Origin</span>
              </div>

              <h2
                className="font-display mb-12"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#FDFBF7',
                  lineHeight: 1.2
                }}
              >
                I didn't set out to build an AI company.
                <span className="italic" style={{ color: '#D4B896' }}> I ran a travel agency.</span>
              </h2>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed" style={{ color: '#C9C3B8' }}>
                    Then one afternoon at a lunch conference, I sat down with six strangers — an actor, a producer, a physician's assistant, a life coach, and a reverend.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#C9C3B8' }}>
                    We started talking about AI. And instead of just talking, I pulled out my iPhone and built personalized GPTs for each of them — right there at the table.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#C9C3B8' }}>
                    No one noticed. Until I slid my phone across and said:
                  </p>
                </div>

                <div className="relative">
                  {/* The pivotal quote */}
                  <div className="relative pl-6 border-l-2 border-gold/40">
                    <p
                      className="font-display italic text-xl leading-relaxed"
                      style={{ color: '#FDFBF7' }}
                    >
                      "Type in anything."
                    </p>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: '#A09A90' }}>
                      They wrote: "What's one thing I need to say to myself I didn't know I needed to say to myself?"
                    </p>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: '#C9C3B8' }}>
                      The AI answered. They froze.
                    </p>
                    <p
                      className="mt-4 font-display italic"
                      style={{ color: '#D4B896', fontSize: '1.125rem' }}
                    >
                      Then they cried.
                    </p>
                  </div>
                </div>
              </div>

              {/* The moment */}
              <div className="mt-16 pt-12 border-t border-cream/10">
                <p
                  className="font-display text-center max-w-2xl mx-auto"
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    color: '#FDFBF7',
                    lineHeight: 1.4
                  }}
                >
                  That was the moment. Galavanteer stopped being about travel.
                  <span className="block mt-2 italic" style={{ color: '#D4B896' }}>
                    It became about transformation.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Validation — From Free to Paid */}
        <section className="relative overflow-hidden" style={{ background: '#F9F6F0' }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-20 lg:py-24">
            <div className="lg:pl-12">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
                    <span className="label">The Validation</span>
                  </div>

                  <h2
                    className="font-display mb-6"
                    style={{
                      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                      color: '#1A1915',
                      lineHeight: 1.15
                    }}
                  >
                    From free to
                    <span className="italic" style={{ color: '#B8956C' }}> $1,000</span>
                  </h2>

                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                      I didn't plan to sell it.
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                      The first person shoved $50 into my hand. The next gave me $150. Then $500.
                    </p>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: '#1A1915' }}>
                      Not because I asked. Because they saw the value before I did.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  {/* Price progression visualization */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { price: 'Free', label: 'The first one' },
                      { price: '$50', label: 'Insisted' },
                      { price: '$150', label: 'Then this' },
                      { price: '$500', label: 'Then this' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="relative p-4 text-center transition-all duration-500 hover:-translate-y-1"
                        style={{
                          background: i === 3 ? '#1A1915' : '#FFFFFF',
                          border: i === 3 ? 'none' : '1px solid rgba(26, 25, 21, 0.08)'
                        }}
                      >
                        {i === 3 && (
                          <>
                            <div className="absolute top-0 left-0 w-4 h-px bg-gold/60" />
                            <div className="absolute top-0 left-0 w-px h-4 bg-gold/60" />
                          </>
                        )}
                        <p
                          className="font-display text-2xl"
                          style={{ color: i === 3 ? '#D4B896' : '#B8956C' }}
                        >
                          {item.price}
                        </p>
                        <p
                          className="text-[10px] uppercase tracking-wider mt-2"
                          style={{ color: i === 3 ? '#7A7368' : '#A09A90' }}
                        >
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p
                      className="font-display text-lg"
                      style={{ color: '#1A1915' }}
                    >
                      Now starting at <span className="italic" style={{ color: '#B8956C' }}>$1,000</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What I Believe */}
        <section className="relative overflow-hidden" style={{ background: '#FDFBF7' }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          {/* Subtle gradient */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full opacity-[0.02]"
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, #B8956C 0%, transparent 60%)',
            }}
          />

          <div className="container py-20 lg:py-24">
            <div className="lg:pl-12 max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/40" />
                <span className="label">The Philosophy</span>
                <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              <h2
                className="font-display mb-8"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  color: '#1A1915',
                  lineHeight: 1.15
                }}
              >
                Most people fear AI will
                <span className="italic" style={{ color: '#B8956C' }}> replace </span>
                them.
              </h2>

              <p
                className="font-display text-xl mb-6"
                style={{ color: '#3D3830' }}
              >
                They're wrong.
              </p>

              <div className="space-y-4 max-w-xl mx-auto">
                <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                  AI makes your voice sharper. Your leadership clearer. Your systems effortless.
                </p>
                <p className="text-sm leading-relaxed font-medium" style={{ color: '#1A1915' }}>
                  I don't build assistants that talk at you.
                  I build tools that think with you.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 my-12">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/30" />
              </div>

              <blockquote
                className="font-display italic text-2xl leading-relaxed"
                style={{ color: '#1A1915' }}
              >
                "AI won't replace you —
                <span style={{ color: '#B8956C' }}> it will amplify you.</span>"
              </blockquote>
            </div>
          </div>
        </section>

        {/* The Method */}
        <section className="relative overflow-hidden" style={{ background: '#1A1915' }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-20 lg:py-28">
            <div className="lg:pl-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-px bg-gradient-to-r from-gold/60 to-transparent" />
                <span className="label" style={{ color: '#7A7368' }}>The Method</span>
              </div>

              <h2
                className="font-display mb-4"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#FDFBF7',
                  lineHeight: 1.15
                }}
              >
                The Voice-First
                <span className="italic" style={{ color: '#D4B896' }}> Approach</span>
              </h2>

              <p className="text-sm max-w-xl mb-12" style={{ color: '#A09A90' }}>
                Five principles that guide every system I build.
              </p>

              <div className="grid md:grid-cols-5 gap-px" style={{ background: 'rgba(184, 149, 108, 0.2)' }}>
                {[
                  { num: '01', title: 'Map the Mind', desc: 'Capture how you think' },
                  { num: '02', title: 'Design in Context', desc: 'Build around real habits' },
                  { num: '03', title: 'Preserve the Voice', desc: 'Train it to sound like you' },
                  { num: '04', title: 'Empower, Don\'t Replace', desc: 'Amplify your ability' },
                  { num: '05', title: 'Refine in Action', desc: 'Evolve as you use it' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="p-6 transition-all duration-500 group"
                    style={{ background: '#1A1915' }}
                  >
                    <span
                      className="font-display text-2xl block mb-4 transition-colors duration-300 group-hover:text-gold"
                      style={{ color: '#D4B896' }}
                    >
                      {step.num}
                    </span>
                    <h3
                      className="font-display text-sm mb-2"
                      style={{ color: '#FDFBF7' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs" style={{ color: '#7A7368' }}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Me — The Backstory */}
        <section className="relative overflow-hidden" style={{ background: '#F9F6F0' }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container py-20 lg:py-24">
            <div className="lg:pl-12 max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
                <span className="label">The Backstory</span>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                  I've always seen the world in systems. As a kid, I jailbroke iPhones just to understand them.
                </p>

                <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                  In the travel industry, I spent a decade designing experiences where failure wasn't an option — because you can't refund a once-in-a-lifetime trip.
                </p>

                <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                  When ChatGPT launched in 2022, I jumped into the beta. I wasn't a programmer, but I figured out how to turn complex code into plain English and build workflows that anyone could use.
                </p>

                <p className="text-sm leading-relaxed font-medium" style={{ color: '#1A1915' }}>
                  By the time the conference rolled around, I had a new lens: AI wasn't a chatbot. It was a mirror.
                </p>

                <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
                  Since then, I've built 20+ systems leaders use every day, been featured on Roku TV, and developed the Voice-First AI Method.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-ink/10">
                <p
                  className="font-display italic text-lg"
                  style={{ color: '#1A1915' }}
                >
                  AI doesn't erase who you are.
                  <span style={{ color: '#B8956C' }}> It amplifies it.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden" style={{ background: '#1A1915' }}>
          <div className="absolute left-8 lg:left-16 top-0 h-32 w-px bg-gradient-to-b from-gold/10 to-transparent" />

          {/* Subtle gradient */}
          <div
            className="absolute top-0 left-1/4 w-[400px] h-[400px] opacity-[0.05]"
            style={{
              background: 'radial-gradient(circle at center, #B8956C 0%, transparent 60%)',
            }}
          />

          <div className="container py-16 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display mb-4" style={{ color: '#FDFBF7' }}>
                Ready to see what's
                <span className="italic" style={{ color: '#D4B896' }}> possible?</span>
              </h2>

              <p className="text-sm leading-relaxed mb-8" style={{ color: '#C9C3B8' }}>
                A 30-minute Clarity Call is where it starts.
                <span style={{ color: '#FDFBF7' }}> No pitch. No pressure.</span>
              </p>

              <a
                href="https://calendly.com/jason-galavanteer/discovery_call"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-medium tracking-wide uppercase transition-all duration-300 hover:bg-gold hover:text-cream hover:shadow-lg group"
                style={{
                  background: '#FDFBF7',
                  color: '#1A1915'
                }}
              >
                <span>Book Your Clarity Call</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>

              <p className="mt-8 text-[10px] tracking-wide uppercase" style={{ color: '#7A7368' }}>
                Limited engagements · Response within 24 hours
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatDiscovery />

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26, 25, 21, 0.95)' }}
          onClick={() => setVideoOpen(false)}
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-6 right-6 p-2 transition-colors"
            style={{ color: '#A09A90' }}
            aria-label="Close video"
          >
            <X size={24} />
          </button>

          <div
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-px bg-gold/60" />
            <div className="absolute -top-2 -left-2 w-px h-8 bg-gold/60" />
            <div className="absolute -bottom-2 -right-2 w-8 h-px bg-gold/60" />
            <div className="absolute -bottom-2 -right-2 w-px h-8 bg-gold/60" />

            {/* Instagram Embed */}
            <div className="relative bg-black" style={{ paddingBottom: '125%' }}>
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

            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: '#7A7368' }}>
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
