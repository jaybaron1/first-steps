import React from "react";

const PILLARS = [
  { title: "A real boardroom, on demand", body: "3–5 executive personas dynamically assembled around the decision in front of you." },
  { title: "Built around the business", body: "Knows the company, customers, and how they actually decide. Loaded once, applied always." },
  { title: "Structured to reach an answer", body: "Alignment, exploration, steering, convergence, and a written deliverable every time." },
  { title: "Private and theirs", body: "Lives inside the client's own ChatGPT. No new tools. No shared logins." },
];

const LEVELS = [
  { n: 1, name: "The Roundtable", body: "Prestige personas, web-informed.", price: "Included" },
  { n: 2, name: "Company Context", body: "Reasons inside the business — what they sell, protect, and how they decide.", price: null },
  { n: 3, name: "You, in the Room", body: "A faithful replica of how the principal actually thinks, decides, speaks.", price: null },
  { n: 4, name: "Future You", body: "Aspirational counterpart that challenges Present You on tradeoffs.", price: null },
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

const ACCENT = "#B8956C";

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
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>What it is</p>
        <h3 className="text-sm font-semibold text-slate-900 mt-2">The Roundtable</h3>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          A private executive boardroom that lives inside the client's own ChatGPT.
          Three to five senior personas — calibrated to their business — show up to think
          through real decisions with them. Every session ends with a structured deliverable.
        </p>
      </div>
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>What it actually does</p>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <p className="text-sm font-semibold text-slate-900 leading-tight">{p.title}</p>
              <p className="text-xs text-slate-600 leading-snug mt-0.5">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Upgrade ladder */}
    <div className="border-t border-slate-200 p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>How deep you go</p>
        <p className="text-[10px] text-slate-400">Editable per partner · blank shows "Quoted on request"</p>
      </div>
      <div className="mt-3 space-y-1.5">
        {LEVELS.map((lvl, i) => (
          <div
            key={lvl.n}
            className="flex items-stretch rounded-sm overflow-hidden"
            style={{
              marginLeft: `${i * 18}px`,
              background: `rgba(15,23,42,${0.04 + i * 0.05})`,
              borderLeft: `3px solid ${ACCENT}`,
            }}
          >
            <div className="w-10 flex items-center justify-center border-r border-slate-900/5">
              <span className="font-serif text-lg font-semibold leading-none" style={{ color: ACCENT }}>{lvl.n}</span>
            </div>
            <div className="flex-1 px-3 py-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-tight">{lvl.name}</p>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">{lvl.body}</p>
              </div>
              <span
                className="text-xs font-bold whitespace-nowrap"
                style={{ color: lvl.price === "Included" ? "#0f172a" : ACCENT }}
              >
                {lvl.price ?? "Quoted on request"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Onboarding + Pricing */}
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200">
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>How onboarding works</p>
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
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: ACCENT }}>What it costs</p>
        <div className="mt-3 flex items-baseline justify-between pb-3 border-b border-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-900">Workspace build (Level 1 included)</p>
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
