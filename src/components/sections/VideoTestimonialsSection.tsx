import React, { useState } from 'react';
import { Play } from 'lucide-react';

const VideoTestimonialsSection = () => {
  const [showCrisPoster, setShowCrisPoster] = useState(true);
  return (
    <section className="section relative overflow-hidden" style={{ background: '#1A1915' }}>
      {/* The Golden Thread continues through dark section */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/20" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="lg:pl-12 mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label text-gold-light">Unscripted</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FDFBF7' }}>
            Hear it from them.
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: '#FDFBF7', opacity: 0.8 }}>
            Real clients. Real outcomes. No scripts.
          </p>
        </div>

        {/* Asymmetric Video Layout */}
        <div className="lg:pl-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Large Featured Video - Carl & Brandon */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group">
              {/* Gold corner accent */}
              <div className="absolute -top-2 -left-2 w-16 h-16 border-l-2 border-t-2 border-gold/40 pointer-events-none" />

              {/* Video Container */}
              <div className="relative overflow-hidden bg-ink-soft" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.instagram.com/reel/DPAEdDAjQup/embed"
                  title="Carl Michel & Brandon Gaydorus testimonial"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    border: 'none',
                    top: '-150%',
                    height: '300%'
                  }}
                />
              </div>

              {/* Bottom accent line */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border-r-2 border-b-2 border-gold/40 pointer-events-none" />
            </div>

            {/* Pull Quote - Brandon */}
            <div className="relative pl-6 border-l-2 border-gold/30">
              <p className="font-display italic text-lg leading-snug mb-3" style={{ color: '#FDFBF7' }}>
                "One of the coolest things about what Jason does is he helps you become more efficient. So you can focus on the things you need to be doing to grow your business."
              </p>
              <div className="text-xs">
                <p className="font-medium mb-1" style={{ color: '#FDFBF7' }}>Brandon Gaydorus</p>
                <p style={{ color: '#C9C3B8' }}>5x Author / Founder of Warm Heart Life / Business & Public Speaking Coach</p>
              </div>
            </div>

            {/* Pull Quote - Carl */}
            <div className="relative pl-6 border-l-2 border-gold/30">
              <p className="font-display italic text-lg leading-snug mb-3" style={{ color: '#FDFBF7' }}>
                "Having a custom GPT is like having a virtual assistant. I'm able to get the thoughts out of my mind and have it structured in a way that is easy for me, but also in my own voice."
              </p>
              <div className="text-xs">
                <p className="font-medium mb-1" style={{ color: '#FDFBF7' }}>Carl Michel</p>
                <p style={{ color: '#C9C3B8' }}>Executive Producer at Youth Empowerment Show | Motivational Speaker | Best-Selling Author</p>
              </div>
            </div>
          </div>

          {/* Right: Vertical Video - Dr. Cris */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group">
              {/* Subtle frame */}
              <div className="absolute inset-0 border border-gold/10 pointer-events-none" style={{ transform: 'translate(8px, 8px)', zIndex: 10 }} />

              {/* Video Container - Vertical aspect ratio for iPhone video */}
              <div className="rounded-xl overflow-hidden shadow-2xl bg-black aspect-[9/16] max-w-[300px] max-h-[500px] mx-auto lg:mx-0 relative">
                <iframe
                  src="https://drive.google.com/file/d/1iUWe7mbq5AEIgi8HISUryNDS_MXW_YQa/preview"
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  allowFullScreen
                  className="border-0"
                  title="Dr. Cris Andrade testimonial"
                />

                {/* Custom Poster Overlay */}
                {showCrisPoster && (
                  <div
                    className="absolute inset-0 cursor-pointer group/poster"
                    onClick={() => setShowCrisPoster(false)}
                    style={{ zIndex: 20 }}
                  >
                    <img
                      src="https://visibility.galavanteer.com/assets/dr-cris-thumbnail-B4SMH1Z3.jpeg"
                      alt="Dr. Cris Andrade"
                      className="w-full h-full object-cover"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover/poster:bg-black/10 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-gold/95 group-hover/poster:bg-gold flex items-center justify-center transition-all group-hover/poster:scale-110 shadow-lg">
                        <Play className="w-8 h-8 ml-1" style={{ color: '#1A1915' }} fill="#1A1915" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pull Quote - Dr. Cris */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-px" style={{ background: '#B8956C', opacity: 0.4 }} />
              <blockquote className="pl-6">
                <p className="font-display italic text-lg leading-snug mb-3" style={{ color: '#FDFBF7' }}>
                  "He built systems that actually work the way you think. He doesn't just answer questions. He gives you tools to solve problems yourself."
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-px" style={{ background: '#B8956C', opacity: 0.4 }} />
                  <span className="font-medium" style={{ color: '#FDFBF7' }}>Dr. Cris Andrade</span>
                </div>
                <p className="text-xs mt-1 pl-9" style={{ color: '#FDFBF7', opacity: 0.7 }}>Manhattan Med Spa</p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="lg:pl-12 mt-16 text-center">
          <p className="text-sm italic" style={{ color: '#FDFBF7', opacity: 0.7 }}>
            Real clients sharing real experiences.
          </p>
        </div>
      </div>

      {/* Atmospheric grain overlay - very subtle on dark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </section>
  );
};

export default VideoTestimonialsSection;
