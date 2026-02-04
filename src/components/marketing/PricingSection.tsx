import { Check, ArrowRight } from 'lucide-react';
import { trackBookCallClick, trackPricingTierClick } from '@/lib/marketingTracking';

const plans = [
  {
    name: 'Foundation',
    subtitle: 'One-time implementation',
    price: 'Starting at $3,500',
    priceNote: 'one-time',
    features: [
      'llms.txt + robots.txt',
      'Core schema markup',
      'Tracking setup (GA4 + attribution)',
      'Validation + walkthrough',
      'Documentation handoff',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: '90-Day Sprint',
    subtitle: 'Paid monthly, ends cleanly',
    price: '$1,700/month',
    priceNote: 'for 3 months',
    features: [
      'Everything in Foundation',
      'Iterative expansions over 90 days',
      'Monthly reporting snapshot',
      'Content briefs (optional)',
      'Priority support',
    ],
    cta: 'Book a Call',
    highlight: true,
  },
  {
    name: 'Maintenance',
    subtitle: 'Ongoing support (optional)',
    price: '$500–$1,500/month',
    priceNote: 'ongoing',
    features: [
      'Monthly monitoring',
      'Schema updates as needed',
      'Quarterly technical audit',
      'Monthly reporting',
      'Slack/email support',
    ],
    cta: 'Learn More',
    highlight: false,
  },
];

const PricingSection = () => {
  const handlePlanClick = (planName: string, price: string) => {
    trackPricingTierClick(planName, price);
    trackBookCallClick('pricing');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  return (
    <section id="pricing" className="mkt-section mkt-section-light">
      <div className="mkt-container">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[hsl(220_20%_15%)]">Choose the level of support you want.</h2>
          <p className="text-[hsl(220_20%_15%/0.7)] max-w-2xl mx-auto">
            Straightforward pricing for real implementation work. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all ${
                plan.highlight
                  ? 'bg-[hsl(220_20%_10%)] text-[hsl(40_20%_95%)] ring-2 ring-[hsl(175_70%_45%)] scale-105'
                  : 'bg-white border border-[hsl(35_20%_85%)] text-[hsl(220_20%_15%)]'
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-[hsl(175_70%_45%)] mb-4 uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-2xl mb-1 ${plan.highlight ? 'text-[hsl(40_20%_95%)]' : 'text-[hsl(220_20%_15%)]'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-[hsl(40_20%_95%/0.7)]' : 'text-[hsl(220_20%_15%/0.6)]'}`}>
                {plan.subtitle}
              </p>

              <div className="mb-6">
                <span className={`text-3xl font-bold ${plan.highlight ? 'text-[hsl(175_70%_45%)]' : 'text-[hsl(220_20%_15%)]'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ml-2 ${plan.highlight ? 'text-[hsl(40_20%_95%/0.6)]' : 'text-[hsl(220_20%_15%/0.5)]'}`}>
                  {plan.priceNote}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-[hsl(175_70%_45%)]' : 'text-[hsl(150_60%_45%)]'}`} />
                    <span className={plan.highlight ? 'text-[hsl(40_20%_95%/0.9)]' : 'text-[hsl(220_20%_15%/0.8)]'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan.name, plan.price)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-[hsl(175_70%_45%)] text-[hsl(220_25%_6%)] hover:bg-[hsl(175_70%_38%)]'
                    : 'bg-[hsl(220_20%_10%)] text-white hover:bg-[hsl(220_20%_15%)]'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[hsl(220_20%_15%/0.6)] text-sm mt-10 max-w-2xl mx-auto">
          <strong>Important note:</strong> No one can guarantee AI citations or rankings. What you get 
          is high-quality implementation and transparent tracking so you can see what is working.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
