import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

 const ComparisonSection = () => {
   const [showDeliverables, setShowDeliverables] = useState(false);
 
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
            <div className="h-full bg-white p-5 lg:p-6 relative">
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
                  <p style={{ color: '#3D3830' }}>Our objective: Evaluate whether to accept a six-month executive engagement with a Fortune 500. Key tension: growth opportunity vs. capacity risk.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Monica — Finance</p>
                  <p style={{ color: '#3D3830' }}>The math doesn't lie. Six months at this scope puts delivery quality at risk. Staying small isn't caused by saying no. It's caused by saying yes without control.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>David — Operations</p>
                  <p style={{ color: '#3D3830' }}>I disagree with a flat no. You say yes <em>only if</em> you redesign the offer around sustainability. Counter with a 90-day pilot.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Elena — Strategy</p>
                  <p style={{ color: '#3D3830' }}>The real risk isn't the work. It's irreversible commitment. If you phase it, you maintain optionality. Enterprise clients respect clarity over bravado.</p>
                </div>
                <div>
                  <p className="font-medium text-[10px] mb-0.5 uppercase tracking-wider" style={{ color: '#5C554A' }}>Facilitator</p>
                  <p style={{ color: '#3D3830' }}>Emerging consensus: Accept with restructured terms. Phase 1 as 90-day pilot with defined scope boundaries. Building deliverables now...</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Multiple perspectives in tension",
                  "Structured thinking, not scattered advice",
                  "A clear path forward, not more noise",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-ink">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Included: </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expand deliverables */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowDeliverables(!showDeliverables)}
            className="inline-flex items-center gap-2 text-warm-gray hover:text-gold-dark transition-colors text-sm"
          >
            <span className="font-medium">
              {showDeliverables ? "Hide" : "View"} full deliverables
            </span>
            {showDeliverables ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDeliverables && (
            <div className="mt-8 bg-white p-6 lg:p-8 max-w-3xl mx-auto text-left shadow-soft">
              <h3 className="font-display text-xl text-ink mb-6">
                Session Deliverables
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
          )}
        </div>

        {/* Pull quote */}
        <div className="mt-12 max-w-xl mx-auto text-center">
          <blockquote className="font-display text-lg text-ink italic leading-relaxed">
            "Bravado doesn't prove readiness.
            <span className="text-gold-dark"> Design does.</span>"
          </blockquote>
          <p className="mt-4 text-xs text-warm-gray">
            From an actual Roundtable session
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
