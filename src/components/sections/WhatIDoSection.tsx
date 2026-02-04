import React from "react";

const WhatIDoSection = () => (
  <section id="what-i-do" className="py-20 bg-white">
    <div className="container max-w-3xl">
      <h2 className="section-title mb-5 text-center">What Galavanteer Does</h2>
      <div className="prose prose-lg mx-auto text-galavanteer-gray/90 mb-6 text-center">
        <p>
          Our approach isn't about selling you a generic "AI chatbot." It's about co-designing a truly personal system that <strong>thinks the way you do</strong> – one that's deeply intentional, easy to use, and built around your workflow, language, and goals.
        </p>
      </div>
      <ul className="space-y-6">
        <li className="bg-galavanteer-purple-light/30 rounded-lg p-5 border border-galavanteer-purple/10">
          <span className="font-semibold text-galavanteer-purple">Personal Collaboration:</span> We spend real, focused time with you – listening, asking questions, and mapping out what you actually need. No system is created without a clear understanding of <em>how you think, communicate, and want to lead.</em>
        </li>
        <li className="bg-galavanteer-gray-light rounded-lg p-5 border border-galavanteer-purple/10">
          <span className="font-semibold text-galavanteer-purple">Made Just For You:</span> Every tool is built in your voice, matches your unique style, and is designed to answer the kinds of questions and challenges you face. It's not off-the-shelf – every detail is intentional.
        </li>
        <li className="bg-galavanteer-purple-light/30 rounded-lg p-5 border border-galavanteer-purple/10">
          <span className="font-semibold text-galavanteer-purple">No Tech Overwhelm:</span> You don't have to learn new software or deal with messy integrations. We deliver your system as a private link – open it, use it, and share it with anyone you trust.
        </li>
        <li className="bg-galavanteer-gray-light rounded-lg p-5 border border-galavanteer-purple/10">
          <span className="font-semibold text-galavanteer-purple">Support & Refinement:</span> After delivery, we stick around for weeks – tuning your system, making adjustments, and supporting you as you start using it "in the wild." You get the benefit of real partnership, not just a handoff.
        </li>
      </ul>
      <div className="mt-10 text-center">
        <span className="inline-block px-5 py-3 rounded-lg bg-galavanteer-purple text-white text-lg font-medium shadow">
          This is thoughtful co-creation, built for real impact – never hype, never generic. 
        </span>
      </div>
    </div>
  </section>
);

export default WhatIDoSection;