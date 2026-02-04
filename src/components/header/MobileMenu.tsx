import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navItems } from './NavItems';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToPage: (path: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: '#FDFBF7' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-ink/5">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
            alt="Galavanteer Logo"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-lg text-ink">
            Galavanteer
          </span>
        </div>
        <button
          className="p-2 text-ink hover:text-gold transition-colors"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <div className="px-8 py-12">
        <nav className="space-y-2">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              to={item.path}
              className="block py-4 border-b border-ink/5 group"
              onClick={onClose}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-ink group-hover:text-gold transition-colors">
                  {item.label}
                </span>
                <span className="text-warm-gray-light font-display text-sm">
                  0{i + 1}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="https://calendly.com/jason-galavanteer/discovery_call"
            className="flex items-center justify-center gap-3 w-full py-4 bg-ink text-cream font-medium text-sm tracking-wider uppercase hover:bg-gold transition-colors"
            onClick={onClose}
          >
            Book a Clarity Call
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-sm text-warm-gray">
          Response within 24 hours.
        </p>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-8 right-8">
        <div className="w-12 h-px bg-gradient-to-r from-gold/30 to-transparent" />
        <div className="w-px h-12 bg-gradient-to-b from-gold/30 to-transparent" />
      </div>
    </div>
  );
};

export default MobileMenu;
