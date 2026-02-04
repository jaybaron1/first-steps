import React from 'react';
import { Menu, X } from 'lucide-react';
import { useMenuControl } from '@/hooks/useMenuControl';
import NavigationMenu from './header/NavigationMenu';
import MobileMenu from './header/MobileMenu';
import Logo from './Logo';
import SkipLink from './SkipLink';

const Header = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    navigateToSection,
    navigateToPage
  } = useMenuControl();

  return (
    <>
      <SkipLink />
      <header className="py-5 border-b border-ink/5 bg-cream/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container flex justify-between items-center">
          <Logo size="medium" showText={true} />

          <button
            className="md:hidden p-2 relative z-50 text-ink"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            style={{ position: 'relative', zIndex: 10000 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <NavigationMenu
            onNavigateToSection={navigateToSection}
            onNavigateToPage={navigateToPage}
          />
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateToSection={navigateToSection}
        onNavigateToPage={navigateToPage}
      />
    </>
  );
};

export default Header;
