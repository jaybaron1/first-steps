import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {

  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  };

  const handleClick = () => {
    // Always scroll to top when clicking logo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link to="/" onClick={handleClick} className="flex items-center gap-3 group">
      <img
        src="/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
        alt="Galavanteer Logo"
        className={`${sizeClasses[size]} object-contain transition-transform group-hover:scale-105`}
      />
      {showText && (
        <span className="font-display text-xl text-ink tracking-tight">
          Galavanteer
        </span>
      )}
    </Link>
  );
};

export default Logo;
