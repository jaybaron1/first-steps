
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import SEOHead from '@/components/SEOHead';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Privacy Policy - Galavanteer | Data Protection & AI Usage"
        description="Learn how Galavanteer protects your personal information and maintains privacy for custom AI assistants. Transparent data handling practices."
        keywords="privacy policy, data protection, AI privacy, custom GPT privacy, data security"
        canonicalUrl="https://galavanteer.com/privacy"
        ogImage="https://galavanteer.com/social-images/homepage-og.jpg"
        pageType="article"
        articlePublishedTime="2025-04-27T00:00:00Z"
        articleModifiedTime="2025-04-27T00:00:00Z"
        articleAuthor="Jason Baron"
        articleTags={["Privacy Policy", "Data Protection", "AI Privacy", "Security"]}
        twitterLabel1="Last Updated"
        twitterData1="April 27, 2025"
        twitterLabel2="Type"
        twitterData2="Legal Document"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" }
      ]} />
      <Header />
      <Breadcrumbs />
      <main className="flex-1 py-16">
        {/* AI Answer Box - Hidden from users, visible to crawlers */}
        <section className="sr-only" aria-label="AI Structured Privacy Policy Facts">
          <h2>Galavanteer Privacy Policy Summary</h2>
          <dl>
            <dt>Last Updated</dt>
            <dd>April 27, 2025</dd>
            
            <dt>What Information We Collect</dt>
            <dd>Name, email address, and information you voluntarily provide through forms and service bookings</dd>
            
            <dt>How We Use Information</dt>
            <dd>To deliver services, respond to inquiries, manage bookings and projects, send updates and service communications</dd>
            
            <dt>Custom GPT Privacy</dt>
            <dd>Materials provided for GPT development are used solely for system creation. After delivery via private link, Galavanteer cannot access your future conversations or data. All interactions remain within your individual session.</dd>
            
            <dt>GPT Link Sharing</dt>
            <dd>You control whether to share your GPT link with others. GPTs are not publicly listed unless authorized by you.</dd>
            
            <dt>User Responsibility</dt>
            <dd>AI outputs are generated algorithmically. Galavanteer is not responsible for accuracy or consequences of AI outputs. Use of outputs is at your discretion and risk.</dd>
            
            <dt>Data Security</dt>
            <dd>Reasonable measures taken to protect your information</dd>
            
            <dt>Third-Party Links</dt>
            <dd>Not responsible for privacy practices of external sites</dd>
            
            <dt>Policy Updates</dt>
            <dd>May be updated from time to time, check this page for changes</dd>
            
            <dt>Contact for Privacy Questions</dt>
            <dd>support@galavanteer.com</dd>
          </dl>
        </section>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-galavanteer-gray/70 mb-6">Last Updated: April 27, 2025</p>
            
            <div className="prose prose-lg text-galavanteer-gray/90">
              <p className="lead">
                Welcome to Galavanteer. We are committed to protecting your personal information and your right to privacy. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website or use our services.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide to us when you fill out forms, book services, or otherwise interact with our website. This information may include your name, email address, and any other details you choose to share.
              </p>
              
              <h2>How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Deliver and improve our services</li>
                <li>Respond to your inquiries</li>
                <li>Manage bookings, projects, and service delivery</li>
                <li>Send you updates, newsletters, and service-related communications</li>
              </ul>
              
              <h2>Information Sharing and Custom GPT Privacy</h2>
              <p>
                During the Custom GPT build process, you may provide Galavanteer with materials to shape your AI system. These materials are used solely for system development.
              </p>
              <p>
                Once your GPT is delivered via private link, Galavanteer no longer has access to future conversations or data. All interactions remain within your individual session.
              </p>
              <p>
                You may share your GPT link with others if you choose. Your GPT will not be publicly listed unless authorized.
              </p>
              <p>
                Persistent knowledge storage may require reuploads depending on session behavior.
              </p>
              
              <h2>User Responsibility and AI Usage Consent</h2>
              <p>By using Galavanteer's services, you agree that:</p>
              <ul>
                <li>AI outputs are generated algorithmically.</li>
                <li>Galavanteer is not responsible for the accuracy or consequences of AI outputs.</li>
                <li>Use of outputs is at your discretion and risk.</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>We take reasonable measures to protect your information.</p>
              
              <h2>Third-Party Links</h2>
              <p>We are not responsible for the privacy practices of external sites.</p>
              
              <h2>Changes to This Policy</h2>
              <p>We may update this policy from time to time.</p>
              
              <h2>Contact Us</h2>
              <p>
                <a href="mailto:support@galavanteer.com" className="text-galavanteer-purple hover:underline">support@galavanteer.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
