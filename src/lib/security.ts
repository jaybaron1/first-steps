
/**
 * Security utilities for consistent security practices
 */

/**
 * Creates a secure cookie string with proper security flags
 */
export const createSecureCookie = (name: string, value: string, maxAge: number = 604800): string => {
  const isProduction = window.location.protocol === 'https:';
  const secureFlag = isProduction ? 'Secure; ' : '';
  
  return `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict; ${secureFlag}HttpOnly=false`;
};

/**
 * Validates external URLs to ensure they're from trusted domains
 */
export const isTrustedDomain = (url: string): boolean => {
  const trustedDomains = [
    'calendly.com',
    'images.unsplash.com',
    'instagram.com',
    'linkedin.com',
    'jasondbaron.com',
    'cdn.gpteng.co',
    'galavanteer.com',
    'zmlxeqfvdnjnzctyhimq.supabase.co'
  ];
  
  try {
    const urlObj = new URL(url);
    return trustedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Sanitizes user input (though not currently used, good to have for future)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};
