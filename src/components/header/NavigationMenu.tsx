import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { navItems } from './NavItems';
import CalendlyModal from '@/components/CalendlyModal';

interface NavigationMenuProps {
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToPage: (path: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  onNavigateToSection,
  onNavigateToPage,
}) => {
  const location = useLocation();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      const sectionId = path.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        onNavigateToPage('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      onNavigateToPage(path);
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-1">
      <ShadcnNavigationMenu>
        <NavigationMenuList className="gap-1">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <button
                onClick={() => handleNavClick(item.path)}
                aria-current={location.pathname === item.path ? "page" : undefined}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors
                  ${location.pathname === item.path
                    ? 'text-ink'
                    : 'text-warm-gray hover:text-ink'
                  }
                `}
              >
                {item.label}
              </button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </ShadcnNavigationMenu>

      <button
        className="ml-6 px-6 py-2.5 text-xs font-medium tracking-wider uppercase bg-ink text-cream hover:bg-gold transition-colors"
        onClick={() => setIsCalendlyOpen(true)}
      >
        Book a Call
      </button>

      <CalendlyModal
        isOpen={isCalendlyOpen}
        onClose={() => setIsCalendlyOpen(false)}
      />
    </nav>
  );
};

export default NavigationMenu;
