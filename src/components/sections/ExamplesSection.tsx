
import React from "react";
import Button from "../Button";

const examplePreviews = [
  {
    title: "AI-Enhanced Resume & Portfolio",
    description: "Transformed a traditional resume into an interactive AI-powered web portfolio, automatically updating content based on new achievements.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Personalized GPT Chatbots for Coaching",
    description: "Built a custom GPT chatbot for a coach, streamlining onboarding with automated Q&A and follow-up scheduling.",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Internal Q&A and Knowledge Bases",
    description: "Developed an internal AI assistant for a small business, enabling instant access to company expertise and documentation.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  }
];

const ExamplesSection = () => <section id="examples" className="bg-gray-50 py-[90px]">
    <div className="container">
      <h2 className="section-title py-0">Client Successes &amp; Examples</h2>
      <p className="section-subtitle mb-10">
        See how creative professionals, coaches, and founders use our AI solutions to stand out, save time, and unlock new opportunities.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {examplePreviews.map((ex, i) => <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <img src={ex.img} alt={ex.title} className="h-44 object-cover w-full" />
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg mb-2 text-galavanteer-purple">{ex.title}</h3>
              <p className="text-galavanteer-gray/80 flex-1">{ex.description}</p>
            </div>
          </div>)}
      </div>
      <Button variant="primary" href="/examples">
        See Full Examples
      </Button>
    </div>
  </section>;
export default ExamplesSection;
