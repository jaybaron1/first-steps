import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import DecisionProcess from './DecisionProcess';

 const ComparisonSection = () => {
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const roundtableRef = useRef<HTMLDivElement>(null);
 
   return (
     <section data-section="comparison" className="section relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label">See The Difference</span>
          </div>
          <h2 className="font-display text-ink max-w-2xl">
            Same question.
            <span className="italic text-warm-gray"> Different results.</span>
          </h2>
        </div>

        {/* Comparison Layout */}
        <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Generic AI */}
          <div className="lg:col-span-2">
            <div className="h-full bg-white p-5 lg:p-6 relative flex flex-col">
              <div className="absolute top-0 left-0 w-8 h-px bg-warm-gray-light/30" />

              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-ink/5">
                <div className="w-7 h-7 rounded-full bg-cream-deep flex items-center justify-center">
                  <span className="text-warm-gray text-xs">AI</span>
                </div>
                <div>
                  <p className="text-sm text-warm-gray">Generic AI</p>
                </div>
              </div>

              <div className="bg-cream-deep/50 p-3 mb-4 text-xs leading-relaxed max-h-40 overflow-y-auto" style={{ color: '#5C554A' }}>
                <p className="italic">
                  "First—pause and breathe. The fact that a Fortune 500 company reached out means you're already operating at the level that attracts enterprise attention. That's not nothing—it's validation of your expertise and reputation.
                </p>
                <p className="italic mt-2">
                  Here's how I'd think about it: This opportunity represents significant growth potential, but you're right to consider the risks. Six months is a long commitment, and scope creep is real..."
                </p>
                <p className="italic mt-2 text-warm-gray-light">
                  [Continues for 800 more words of general advice...]
                </p>
              </div>

              <div className="space-y-2">
                {[
                  "One voice",
                  "Long, unstructured output",
                  "Requires you to figure out what matters",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-warm-gray">
                    <X className="w-3 h-3 text-warm-gray-light flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Limited: </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center border-t border-ink/5 mt-6">
              <div className="text-center">
                <p className="text-base font-medium text-ink">You can prompt ChatGPT.</p>
                <p className="text-sm text-warm-gray mt-1">It won't challenge your thinking like this.</p>
              </div>
              </div>
            </div>
          </div>

          {/* The Roundtable */}
          <div className="lg:col-span-3">
            <div className="h-full bg-white p-5 lg:p-6 relative shadow-soft">
              <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-gold to-transparent" />

              <div className="absolute -top-2.5 left-6 bg-ink text-cream text-[10px] font-medium px-3 py-1 uppercase tracking-wider">
                The Roundtable
              </div>

              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-ink/5 mt-2">
                <div className="w-8 h-8 bg-gold/10 flex items-center justify-center">
                  <span className="text-gold-dark text-xs font-display italic">R</span>
                </div>
                <div>
                  <p className="text-sm text-ink">Strategic Session</p>
                </div>
              </div>

              {/* Dialogue preview — expanded to show real deliberation */}
              <div className="bg-cream p-4 mb-4 text-xs space-y-3 max-h-56 overflow-y-auto border-l-2 border-gold/40">
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Facilitator</p>
                  <p style={{ color: '#3D3830' }}>Our objective: Decide whether The Winning Moments should accept a six-month executive leadership engagement with a Fortune 500 company, given the opportunity size, delivery risk, and readiness implications.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Monica — Finance</p>
                  <p style={{ color: '#3D3830' }}>Staying small is not caused by saying no. Staying small is caused by saying yes to the wrong structure. The question is not "am I ready?" The question is "can this be structured so failure is unlikely?"</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>David — Operator</p>
                  <p style={{ color: '#3D3830' }}>If the only way this works is you carrying it all, you're not being brave. You're being reckless.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Facilitator</p>
                  <p style={{ color: '#3D3830' }}>Here's the convergence. You say yes to the opportunity, but no to an uncontrolled six-month commitment.</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Multiple perspectives interacting",
                  "Structured thinking you can follow",
                  "Clear direction at the end",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-ink">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Included: </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Expand buttons inside the card */}
              <div className="mt-6 space-y-3 text-center">
                <div>
                  <button
                    onClick={() => setShowDeliverables(!showDeliverables)}
                    className="inline-flex items-center gap-1.5 text-warm-gray hover:text-gold-dark transition-colors text-base"
                  >
                    <span>
                      {showDeliverables ? "Hide" : "See a"} sample output
                    </span>
                    {showDeliverables ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => setShowDecision(!showDecision)}
                    className="inline-flex items-center gap-1.5 text-warm-gray hover:text-gold-dark transition-colors text-base"
                  >
                    <span>
                      {showDecision ? "Hide" : "See"} how it was decided
                    </span>
                    {showDecision ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content — centered below the grid */}
        <div
          className="grid transition-all duration-500 ease-in-out mt-8"
          style={{ gridTemplateRows: showDeliverables ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="bg-white p-6 lg:p-8 max-w-3xl mx-auto text-left shadow-soft"
              style={{ opacity: showDeliverables ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
            >
              <h3 className="font-display text-xl text-ink mb-6">
                Sample Session Deliverables
              </h3>

              <div className="space-y-6">
                <div className="pb-6 border-b border-ink/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gold text-sm font-display">01</span>
                    <span className="label label-gold text-xs">Executive Summary</span>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    A clear recommendation with reasoning. In this case: accept the opportunity, but restructure the terms to protect delivery quality.
                  </p>
                </div>

                <div className="pb-6 border-b border-ink/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gold text-sm font-display">02</span>
                    <span className="label label-gold text-xs">Action Plan</span>
                  </div>
                  <div className="text-sm text-ink-muted space-y-2">
                    <p>• Design Phase One as 90-day pilot (7-10 days)</p>
                    <p>• Define non-negotiable scope boundaries (with proposal)</p>
                    <p>• Build expansion language for months 4-6 (in proposal)</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gold text-sm font-display">03</span>
                    <span className="label label-gold text-xs">Key Insights</span>
                  </div>
                  <ul className="text-sm text-ink-muted space-y-2">
                    <li>• The real risk was irreversible commitment without control</li>
                    <li>• Enterprise clients value clarity over exaggerated confidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid transition-all duration-500 ease-in-out mt-6"
          style={{ gridTemplateRows: showDecision ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="bg-white p-6 lg:p-8 max-w-3xl mx-auto text-left shadow-soft"
              style={{ opacity: showDecision ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
            >
              <DecisionProcess />
            </div>
          </div>
        </div>

        {/* Collapse button — appears when either panel is expanded */}
        {(showDeliverables || showDecision) && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => { setShowDeliverables(false); setShowDecision(false); }}
              className="group inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-warm-gray hover:text-gold-dark transition-all duration-300"
            >
              <span className="font-medium">Collapse</span>
              <div className="w-6 h-6 rounded-full border border-gold/30 group-hover:border-gold group-hover:bg-gold/5 flex items-center justify-center transition-all duration-300">
                <ChevronUp className="w-3 h-3" />
              </div>
            </button>
          </div>
        )}

        {/* Cream spacer between cards area and quote */}
        <div className="h-8" />

        {/* Pull quote */}
        <div className="max-w-xl mx-auto text-center">
          <blockquote className="font-display text-2xl lg:text-3xl text-ink italic leading-relaxed">
            "Bravado doesn't prove readiness.
            <span className="text-gold-dark"> Design does.</span>"
          </blockquote>
          <p className="mt-4 text-sm text-warm-gray">
            From an actual Roundtable session
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
