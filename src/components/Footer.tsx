import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, ExternalLink, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#1A1915' }}>
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
                alt="Galavanteer Logo"
                className="h-10 w-10 object-contain brightness-0 invert opacity-90"
              />
              <span className="font-display text-xl text-cream">
                Galavanteer
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#A09A90' }}>
              Strategic intelligence systems for founders and executives
              who refuse to think alone.
            </p>

            {/* Social links */}
            <div className="flex gap-4 mt-8">
              {[
                { icon: Instagram, href: "https://www.instagram.com/galavanteer_ai", label: "Instagram" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/jasondbaron", label: "LinkedIn" },
                { icon: Mail, href: "mailto:jason@galavanteer.com", label: "Email" },
                { icon: ExternalLink, href: "https://jasondbaron.com", label: "Personal Website" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : "_blank"}
                  rel={href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                  className="hover:text-gold transition-colors"
                  style={{ color: '#7A7368' }}
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="label mb-6" style={{ color: '#C9C3B8' }}>Navigate</p>
            <nav className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'How It Works', to: '/#how-it-works' },
                { label: 'Pricing', to: '/#pricing' },
                { label: 'About', to: '/about' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-sm hover:text-cream transition-colors"
                  style={{ color: '#A09A90' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <p className="label mb-6" style={{ color: '#C9C3B8' }}>Legal</p>
            <nav className="space-y-3">
              <Link
                to="/privacy"
                className="block text-sm hover:text-cream transition-colors"
                style={{ color: '#A09A90' }}
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ color: '#7A7368' }}>
              © {new Date().getFullYear()} Galavanteer. All rights reserved.
            </p>
            <p className="text-xs italic font-display" style={{ color: '#7A7368' }}>
              Built for those who build.
            </p>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <div className="w-16 h-px bg-gradient-to-r from-gold/20 to-transparent" />
        <div className="w-px h-16 bg-gradient-to-b from-gold/20 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
