import React from "react";
import CaseStoryCard from "@/components/examples/CaseStoryCard";
import { caseStories, impactSummary } from "@/data/caseStories";

const CaseStudiesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white" data-animate>
      <div className="container max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="section-title">Case Studies</h2>
          <p className="section-subtitle mx-auto">
            A few ways custom systems created clarity, saved time, and kept each client’s real voice intact.
          </p>
        </div>

        <div className="grid gap-8">
          {caseStories.map((story, idx) => (
            <CaseStoryCard key={idx} {...story} />
          ))}
          <CaseStoryCard {...impactSummary} />
        </div>

        <div className="text-center mt-10">
          <a href="/pricing" className="btn-primary inline-flex items-center gap-2 hover-scale">Build My Custom GPT</a>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
