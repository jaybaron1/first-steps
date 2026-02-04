import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import StructuredData from '@/components/StructuredData';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const getBreadcrumbLabel = (pathname: string): string => {
    const labels: Record<string, string> = {
      'examples': 'Real Wins',
      'about': 'About Galavanteer',
      'pricing': 'Pricing Plans',
      'real-wins': 'Real Wins',
      'experience': 'Experience AI Systems',
      'faq': 'Frequently Asked Questions',
      'privacy': 'Privacy Policy'
    };
    return labels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  if (pathnames.length === 0) return null;

  const baseUrl = 'https://galavanteer.com';
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}/`
    },
    ...pathnames.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: getBreadcrumbLabel(segment),
      item: `${baseUrl}/${pathnames.slice(0, index + 1).join('/')}`
    }))
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="py-2">
        <div className="container">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                to="/" 
                className="flex items-center text-galavanteer-gray/70 hover:text-galavanteer-purple transition-colors"
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            {pathnames.map((pathname, index) => {
              const href = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const label = getBreadcrumbLabel(pathname);
              return (
                <li key={pathname} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-galavanteer-gray/40 mx-2" />
                  {isLast ? (
                    <span className="text-galavanteer-gray font-medium" aria-current="page">
                      {label}
                    </span>
                  ) : (
                    <Link 
                      to={href}
                      className="text-galavanteer-gray/70 hover:text-galavanteer-purple transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;