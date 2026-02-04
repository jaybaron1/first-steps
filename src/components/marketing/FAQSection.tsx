import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackFaqOpen } from '@/lib/marketingTracking';

const faqs = [
  {
    question: 'Do I need to rebuild my website?',
    answer: 'No. This work happens on top of your existing site. I add files, markup, and configuration without changing your design or content. Most implementations require no changes to what visitors see.',
  },
  {
    question: 'Can you guarantee I show up in AI?',
    answer: 'No one can guarantee that. AI engines make their own decisions about what to recommend. What I can guarantee is that your site will be properly structured and machine-readable, which significantly improves your chances. And we track everything so you can see what is working.',
  },
  {
    question: 'How do you track AI referrals?',
    answer: 'We use a combination of UTM parameters, referrer analysis, and custom attribution tracking. When someone arrives from ChatGPT, Perplexity, or other AI engines, we capture that information so you can see which leads came from AI sources.',
  },
  {
    question: 'What do you need from me to start?',
    answer: 'Usually just admin access to your website (WordPress, Shopify, etc.) and access to Google Search Console if you have it. For some platforms, I may need FTP or hosting panel access. I will tell you exactly what is needed on our first call.',
  },
  {
    question: 'Will this hurt my existing SEO?',
    answer: 'No. This work is additive and follows all best practices. Structured data, llms.txt, and proper robots.txt configuration are all things Google and other search engines recommend. If anything, most clients see improved search performance as a side effect.',
  },
  {
    question: 'What platforms do you support?',
    answer: 'WordPress, Shopify, Webflow, Squarespace, Wix, and custom-built sites. If your platform allows adding files and code snippets (most do), I can work with it. If you are unsure, just ask on our call.',
  },
  {
    question: 'Can you work with my developer?',
    answer: 'Absolutely. I am happy to collaborate with your existing team or handle everything myself. Many clients have me work directly, while others prefer I provide specifications for their developer to implement.',
  },
  {
    question: 'What happens if I redesign later?',
    answer: 'The structured data and configurations are designed to be portable. If you redesign your site, most of the work carries over. I also document everything so your developer (or I) can update things as needed during a redesign.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number, question: string) => {
    if (openIndex !== index) {
      trackFaqOpen(question);
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="mkt-section">
      <div className="mkt-container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="text-[hsl(220_10%_50%)] max-w-2xl mx-auto">
            Straight answers to common questions about AI visibility implementation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[hsl(220_15%_20%)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index, faq.question)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[hsl(220_25%_6%/0.5)] transition-colors"
                >
                  <span className="font-semibold text-[hsl(40_20%_95%)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[hsl(175_70%_45%)] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-[hsl(220_10%_50%)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
