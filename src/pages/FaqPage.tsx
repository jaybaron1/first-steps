import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ChatDiscovery from '@/components/ChatDiscovery';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FaqPage = () => {
  const faqItems = [
    {
      question: 'What exactly is a "Custom Operating System Build"?',
      answer: "A Custom Operating System Build is a private co-creation assistant trained specifically on your voice, workflows, and needs – not a generic model. It's designed to act, think, and communicate in alignment with you."
    },
    {
      question: 'How is a Galavanteer system different from using ChatGPT on my own?',
      answer: "Galavanteer systems are professionally crafted operating systems – tuned to your unique voice, style, and goals. Instead of you spending hours \"training\" ChatGPT manually, we embed your thinking patterns directly into a ready-to-use system."
    },
    {
      question: 'What happens after I get my Custom Operating System?',
      answer: "You'll receive a private link to your system along with usage guidance. You also get 30 days of free refinement support to adjust anything based on real-world use."
    },
    {
      question: 'What if I need more changes later?',
      answer: "You can choose between two ongoing support options: Basic Support ($50/month) for individuals using a personal system, which includes hosting, maintenance, one monthly refinement session, and email support. For businesses, Pro Support ($150/month) adds priority response times, additional refinement sessions, and strategic tuning as your business evolves. Any development beyond included support is billed at Galavanteer's standard $100/hour rate."
    },
    {
      question: 'How does ongoing support work?',
      answer: "Basic Support ($50/month) includes one 30-minute refinement session per month, hosting, maintenance, and email support with 2-3 day turnaround. Pro Support ($150/month) offers two monthly refinement sessions (or 60 minutes total), priority 24-hour response, and light voice/strategy tuning as your business evolves."
    },
    {
      question: 'Can I book a single session instead of building a full system?',
      answer: "Yes. Our 1:1 Strategy Sessions ($100/hour) provide strategy, workflow design, and system advice without requiring a full custom build."
    },
    {
      question: 'Is this only for business owners?',
      answer: "No. Galavanteer builds systems for founders, creatives, leaders, thinkers, and anyone who wants smarter, more human-centered co-creation tools for work or personal growth."
    },
    {
      question: 'What do I need to provide to start?',
      answer: "Before building, you'll send samples of your writing, speaking, or social content. This ensures your system matches your voice and thinking style authentically."
    },
    {
      question: 'What platform is my system hosted on?',
      answer: "Your system is hosted privately through OpenAI's infrastructure and delivered via a shareable link. No additional technical setup or software installation is required."
    },
    {
      question: 'Can my system be expanded later?',
      answer: "Yes. You can evolve a single system into a multi-system advisory board if you want more specialized roles or more advanced functionality."
    },
    {
      question: 'What if I don\'t like it?',
      answer: "We spend time up front to capture your real voice and goals. Plus, you have 30 days of included refinement support after launch to adjust anything needed. Your satisfaction is part of the build process."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="FAQ - Frequently Asked Questions | Galavanteer"
        description="Get answers to common questions about custom AI assistant development, co-creation tools, pricing, and our process. Learn how Galavanteer creates personalized AI systems."
        keywords="custom AI FAQ, GPT development questions, AI assistant pricing, custom GPT support, AI consulting questions"
        canonicalUrl="https://galavanteer.com/faq"
        ogImage="https://galavanteer.com/social-images/faq-og.jpg"
        schemaData={faqSchema}
        twitterLabel1="Questions"
        twitterData1="11+ answered"
        twitterLabel2="Topics"
        twitterData2="Pricing, process & support"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" }
      ]} />
      <Header />
      <Breadcrumbs />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-white to-galavanteer-purple-light/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Frequently Asked Questions
              </h1>
              <p className="text-xl mb-6 text-galavanteer-gray">
                Straight answers, no fluff. Here's what most people want to know before building with Galavanteer.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-galavanteer-gray/10 rounded-lg p-2 bg-galavanteer-gray-light/30"
                  >
                    <AccordionTrigger className="text-left font-medium text-galavanteer-gray px-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-galavanteer-gray/80">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-12 text-center">
                <p className="text-lg mb-4 text-galavanteer-gray">Still have questions?</p>
                <div className="mb-6">
                  <p className="text-galavanteer-gray/80 mb-4">
                    Explore <a href="/pricing" className="text-galavanteer-purple hover:underline font-medium">transparent pricing for custom AI assistants</a>, <a href="/examples" className="text-galavanteer-purple hover:underline font-medium">see real client results and time savings</a>, or <a href="/about" className="text-galavanteer-purple hover:underline font-medium">learn about Jason Baron and the Galavanteer story</a>.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  href="https://calendly.com/jason-galavanteer/discovery_call"
                  className="flex items-center justify-center gap-2 mx-auto"
                >
                  Book a Call <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatDiscovery />
    </div>
  );
};

export default FaqPage;