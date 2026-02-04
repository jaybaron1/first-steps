import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Page Not Found | Galavanteer</title>
        <link rel="canonical" href="https://galavanteer.com/404" />
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-lg text-galavanteer-gray/80 mb-6">Let’s get you back to the good stuff.</p>
          <div className="flex items-center justify-center gap-3">
            <a href="/" className="btn-secondary">Home</a>
            <a href="/pricing" className="btn-primary">Build My Custom GPT</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
