import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { trackBookCallClick, trackVideoPlay } from '@/lib/marketingTracking';

const ProofSection = () => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBookCall = () => {
    trackBookCallClick('proof');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  return (
    <section id="proof" className="mkt-section mkt-section-warm">
      <div className="mkt-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video Embed */}
          <div className="relative">
            <div 
              ref={embedRef}
              className="rounded-xl overflow-hidden shadow-2xl bg-white"
              onClick={() => trackVideoPlay('Dr. Cris Testimonial', 'proof_section')}
            >
              <blockquote 
                className="instagram-media" 
                data-instgrm-captioned 
                data-instgrm-permalink="https://www.instagram.com/reel/DR6NX14jdad/?utm_source=ig_embed&amp;utm_campaign=loading" 
                data-instgrm-version="14" 
                style={{ 
                  background: '#FFF', 
                  border: 0, 
                  borderRadius: '3px', 
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
                  margin: '1px', 
                  maxWidth: '540px', 
                  minWidth: '326px', 
                  padding: 0, 
                  width: '99.375%',
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a 
                    href="https://www.instagram.com/reel/DR6NX14jdad/?utm_source=ig_embed&amp;utm_campaign=loading" 
                    style={{ 
                      background: '#FFFFFF', 
                      lineHeight: 0, 
                      padding: '0 0', 
                      textAlign: 'center', 
                      textDecoration: 'none', 
                      width: '100%' 
                    }} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '40px', marginRight: '14px', width: '40px' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '100px' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '60px' }}></div>
                      </div>
                    </div>
                    <div style={{ padding: '19% 0' }}></div>
                    <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div style={{ paddingTop: '8px' }}>
                      <div style={{ color: '#3897f0', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 550, lineHeight: '18px' }}>
                        View this post on Instagram
                      </div>
                    </div>
                  </a>
                </div>
              </blockquote>
            </div>
          </div>

          {/* Right: Context */}
          <div>
            <h2 className="mb-6 text-[hsl(220_20%_15%)]">A real client, explaining the result.</h2>
            
            <p className="text-[hsl(220_20%_15%/0.8)] mb-6 leading-relaxed">
              Dr. Cris runs a Shopify aesthetics clinic in Manhattan. She was paying for SEO but 
              completely invisible online. Jason spent about 90 minutes rebuilding how her business 
              shows up to AI and search, and within three weeks a real patient used AI to find her 
              and booked a $1,500 treatment.
            </p>
            
            <p className="text-[hsl(220_20%_15%/0.8)] mb-8 leading-relaxed">
              This is the kind of shift this work is designed to create.
            </p>

            {/* Pull Quote */}
            <blockquote className="border-l-4 border-[hsl(175_70%_45%)] pl-6 mb-8">
              <p className="text-xl font-medium text-[hsl(220_20%_15%)] italic leading-relaxed">
                "Three weeks later, a real customer used AI to find me and booked a $1,500 treatment."
              </p>
              <cite className="text-sm text-[hsl(220_20%_15%/0.6)] not-italic mt-2 block">
                — Dr. Cris, Manhattan Med Spa
              </cite>
            </blockquote>

            <button onClick={handleBookCall} className="mkt-btn mkt-btn-primary">
              Book a Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
