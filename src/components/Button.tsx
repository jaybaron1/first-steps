
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button';
import { trackCalendlyClick, trackCTAClick } from '@/lib/gtm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = ({ 
  variant = 'primary', 
  children, 
  className,
  href,
  target,
  rel,
  onClick,
  ...props 
}: ButtonProps) => {
  // Map our custom variants to shadcn variants
  const shadcnVariant = variant === 'primary' 
    ? 'default' 
    : 'outline';
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const currentPath = window.location.pathname;
    
    // Track Calendly clicks
    if (href && href.includes('calendly.com')) {
      trackCalendlyClick(currentPath);
    }
    
    // Track general CTA clicks
    if (href) {
      const buttonText = typeof children === 'string' ? children : 'CTA Button';
      trackCTAClick(buttonText, currentPath, href);
    }
    
    if (onClick) {
      onClick(e as any);
    }
  };
  
  if (href) {
    return (
      <ShadcnButton 
        variant={shadcnVariant} 
        className={className}
        asChild
        {...props}
      >
        <a href={href} target={target} rel={rel} onClick={handleClick}>{children}</a>
      </ShadcnButton>
    );
  }
  
  return (
    <ShadcnButton 
      variant={shadcnVariant} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;

