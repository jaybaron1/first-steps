import { Phone, FileSearch, Rocket, LineChart } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    title: 'Call',
    description: 'Confirm fit, goals, and site platform. We discuss what you need and whether this is the right approach.',
  },
  {
    icon: FileSearch,
    title: 'Blueprint',
    description: 'Map llms.txt, schema, robots.txt, and tracking. I create a clear plan for your specific site.',
  },
  {
    icon: Rocket,
    title: 'Implement',
    description: 'Deploy and validate. I install everything and confirm it is working correctly.',
  },
  {
    icon: LineChart,
    title: 'Track',
    description: 'Confirm attribution and deliver a results snapshot template. You see what is working.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="mkt-section">
      <div className="mkt-container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Simple process. No chaos.</h2>
          <p className="text-[hsl(220_10%_50%)] max-w-2xl mx-auto">
            Most sites take 3–10 days depending on access and complexity.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(175_70%_45%/0.1)] via-[hsl(175_70%_45%/0.3)] to-[hsl(175_70%_45%/0.1)]" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="flex flex-col items-center">
                  <div className="relative z-10 w-16 h-16 rounded-full bg-[hsl(220_25%_6%)] border-2 border-[hsl(175_70%_45%)] flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-[hsl(175_70%_45%)]" />
                  </div>
                  
                  <span className="text-[hsl(175_70%_45%)] text-sm font-semibold mb-2">
                    Step {index + 1}
                  </span>
                  
                  <h3 className="text-xl text-center mb-3">{step.title}</h3>
                  
                  <p className="text-[hsl(220_10%_50%)] text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector arrow - mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-[hsl(175_70%_45%/0.3)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[hsl(220_10%_50%)] text-sm mt-12">
          Timeline note: Most sites complete in 3–10 days depending on access and complexity.
        </p>
      </div>
    </section>
  );
};

export default HowItWorksSection;
