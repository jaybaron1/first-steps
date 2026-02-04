
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useMenuControl = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const navigateToSection = (sectionId: string) => {
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection instanceof HTMLElement) {
        heroSection.style.position = 'relative';
        heroSection.style.zIndex = '1';
      }
    }

    return () => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection instanceof HTMLElement) {
        heroSection.style.position = '';
        heroSection.style.zIndex = '';
      }
    };
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    navigateToSection,
    navigateToPage,
  };
};
