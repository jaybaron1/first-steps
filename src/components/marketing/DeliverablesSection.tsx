import { FileText, Bot, Code2, HelpCircle, Wrench, BarChart3 } from 'lucide-react';

const deliverables = [
  {
    icon: FileText,
    title: 'llms.txt (AI discovery file)',
    plain: 'A structured file that tells AI who you are, what you do, and answers common questions.',
    background: 'Helps AI cite you accurately.',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: Bot,
    title: 'AI-aware robots.txt',
    plain: 'Lets the right bots crawl your revenue pages and blocks low-value scrapers when appropriate.',
    background: 'Cleaner crawl signals.',
    span: 'col-span-1',
  },
  {
    icon: Code2,
    title: 'Advanced schema (structured data)',
    plain: 'Adds machine-readable meaning to your services, locations, FAQs, and key pages.',
    background: 'Rich results eligibility.',
    span: 'col-span-1',
  },
  {
    icon: HelpCircle,
    title: 'FAQ structure for AI + search',
    plain: 'Your key questions are structured so machines can extract them cleanly.',
    background: 'Supports citation and long-tail discovery.',
    span: 'col-span-1',
  },
  {
    icon: Wrench,
    title: 'Technical cleanup',
    plain: 'Fixes issues that confuse crawlers or break page rendering (including script issues).',
    background: 'Removes silent blockers.',
    span: 'col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Tracking and proof setup',
    plain: 'We capture AI and search referrals so you can measure leads and outcomes.',
    background: 'Attribution-ready.',
    span: 'col-span-1 md:col-span-2',
  },
];

const DeliverablesSection = () => {
  return (
    <section id="deliverables" className="mkt-section">
      <div className="mkt-container">
        <div className="text-center mb-12">
          <h2 className="mb-4">What I actually install on your site.</h2>
          <p className="text-[hsl(220_10%_50%)] max-w-2xl mx-auto">
            This is implementation work, not a PDF report. Here is what gets deployed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {deliverables.map((item, index) => (
            <div
              key={index}
              className={`mkt-card group ${item.span}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(175_70%_45%/0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(175_70%_45%/0.2)] transition-colors">
                  <item.icon className="w-5 h-5 text-[hsl(175_70%_45%)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2 text-[hsl(40_20%_95%)]">{item.title}</h3>
                  <p className="text-[hsl(40_20%_95%/0.8)] text-sm mb-3 leading-relaxed">
                    {item.plain}
                  </p>
                  <p className="text-xs text-[hsl(175_70%_45%/0.8)] italic">
                    In the background: {item.background}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
