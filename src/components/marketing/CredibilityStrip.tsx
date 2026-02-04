import { Wrench, BarChart3, DollarSign } from 'lucide-react';

const proofPoints = [
  {
    icon: Wrench,
    text: 'Implementation — not a generic audit',
  },
  {
    icon: BarChart3,
    text: 'AI referral tracking included',
  },
  {
    icon: DollarSign,
    text: 'Client result: $1,500 AI-booked treatment in 3 weeks',
  },
];

const CredibilityStrip = () => {
  return (
    <section className="py-6 border-y border-[hsl(220_15%_20%)] bg-[hsl(220_25%_6%/0.5)]">
      <div className="mkt-container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {proofPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm text-[hsl(40_20%_95%/0.8)]"
            >
              <point.icon className="w-4 h-4 text-[hsl(175_70%_45%)] flex-shrink-0" />
              <span>{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredibilityStrip;
