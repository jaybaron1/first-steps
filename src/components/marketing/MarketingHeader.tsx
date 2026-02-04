import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { trackBookCallClick } from '@/lib/marketingTracking';

const navItems = [
  { label: 'Why', href: '#why' },
  { label: 'Scorecard', href: '#scorecard' },
  { label: 'What You Get', href: '#deliverables' },
  { label: 'Proof', href: '#proof' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const MarketingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/marketing' || location.pathname === '/marketing/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#') && isHomePage) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookCall = () => {
    trackBookCallClick('header');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[hsl(220_25%_6%/0.95)] backdrop-blur-md border-b border-[hsl(220_15%_20%)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mkt-container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-[hsl(40_20%_95%)]"
          >
            <span className="text-[hsl(175_70%_45%)]">AI Visibility</span>
            <span className="text-[hsl(40_20%_95%/0.6)] font-normal">by Galavanteer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isHomePage && navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 text-sm font-medium text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
              >
                {item.label}
              </button>
            ))}
            {!isHomePage && (
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
              >
                Home
              </Link>
            )}
            <Link
              to="/results"
              className="px-4 py-2 text-sm font-medium text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
            >
              Results
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={handleBookCall}
              className="mkt-btn mkt-btn-primary"
            >
              Book a Call
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[hsl(40_20%_95%)]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[hsl(220_25%_6%/0.98)] backdrop-blur-md border-b border-[hsl(220_15%_20%)] py-4">
            <div className="mkt-container flex flex-col gap-2">
              {isHomePage && navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="px-4 py-3 text-left text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-left text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
                >
                  Home
                </Link>
              )}
              <Link
                to="/results"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-left text-[hsl(40_20%_95%/0.7)] hover:text-[hsl(175_70%_45%)] transition-colors"
              >
                Results
              </Link>
              <div className="pt-2 px-4">
                <button
                  onClick={handleBookCall}
                  className="mkt-btn mkt-btn-primary w-full"
                >
                  Book a Call
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MarketingHeader;
