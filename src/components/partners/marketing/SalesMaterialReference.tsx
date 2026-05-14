import React from "react";

const PILLARS = [
  {
    title: "A real boardroom, on demand",
    body: "3–5 executive personas dynamically assembled around the decision in front of you.",
  },
  {
    title: "Built around the business",
    body: "Knows your company, customers, and how you actually decide. Loaded once, applied always.",
  },
  {
    title: "Structured to reach an answer",
    body: "Every session moves through alignment, exploration, your steering, convergence, and a written deliverable.",
  },
  {
    title: "Private and yours",
    body: "Lives inside the client's own ChatGPT workspace. No new tools. No shared logins.",
  },
];

const ONBOARDING = [
  { title: "Call", body: "Confirm fit, goals, and how the client actually works today." },
  { title: "Blueprint", body: "Map personas, voice, decisions, and integrations that matter." },
  { title: "Implement", body: "Build the workspace and validate it against the real workflow." },
  { title: "Track", body: "Confirm adoption and deliver a results snapshot." },
];

const ADDONS = [
  { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / month" },
  { label: "Each additional user", price: "$100 / month" },
  { label: "Optional ongoing maintenance", price: "$200 / month" },
];

const SalesMaterialReference: React.FC = () => (
  <section className="mb-10 border border-slate-200 rounded-lg bg-white">
    <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Sales material</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Reference talk-track for you. The downloadable Sales Sheet below uses the same structure.
        </p>
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Internal</span>
    </header>

    {/* What it is + What you get */}
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] divide-y md:divide-y-0 md:divide-x divide-slate-200">
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B8956C] font-semibold">What it is</p>
        <h3 className="text-sm font-semibold text-slate-900 mt-2">The Roundtable</h3>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          A private executive boardroom that lives inside the client's own ChatGPT.
          Three to five senior personas — calibrated to their business — show up to think
          through real decisions with them. Every session ends with a structured deliverable
          they can act on.
        </p>
      </div>

      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B8956C] font-semibold">What it actually does</p>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
          {PILLARS.map((p, i) => (
            <li key={p.title} className="flex gap-2.5">
              <span className="text-xs font-semibold text-slate-400 mt-0.5">0{i + 1}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{p.title}</p>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Onboarding + Pricing */}
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200">
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B8956C] font-semibold">How onboarding works</p>
        <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          {ONBOARDING.map((s, i) => (
            <li key={s.title} className="flex gap-2.5">
              <span className="text-xs font-semibold text-slate-400 w-5 shrink-0 mt-0.5">0{i + 1}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{s.title}</p>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B8956C] font-semibold">What it costs</p>
        <div className="mt-3 flex items-baseline justify-between pb-3 border-b border-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-900">Workspace build</p>
            <p className="text-[11px] text-slate-500">One-time setup. Editable per partner.</p>
          </div>
          <p className="text-xl font-semibold text-slate-900 font-serif">$6,000</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mt-3 mb-2">
          Not included — billed separately
        </p>
        <ul className="space-y-1.5">
          {ADDONS.map((row) => (
            <li key={row.label} className="flex justify-between text-xs text-slate-600">
              <span>{row.label}</span>
              <span className="font-semibold text-slate-900">{row.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default SalesMaterialReference;
