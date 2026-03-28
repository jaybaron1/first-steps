import React from 'react';

interface DialogueEntry {
  speaker: string;
  role?: string;
  lines: string[];
  isUser?: boolean;
  isFacilitator?: boolean;
}

const dialogue: DialogueEntry[] = [
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: [
      'Welcome, John. Welcome to The Winning Moments Boardroom — powered by Galavanteer.',
      'Before we begin, let me get us aligned.',
      'What would you like this session to accomplish today?',
    ],
  },
  {
    speaker: 'John',
    isUser: true,
    lines: [
      'A Fortune 500 company reached out. They want me to design a 6-month executive leadership program for their senior team. I\'ve only ever done workshops and single-day experiences. This would be my first long-term corporate engagement. The potential revenue is significant, but I\'m not sure I\'m ready for something this big. Should I say yes?',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: [
      'Our objective for this session is to decide whether The Winning Moments should accept a six-month executive leadership engagement with a Fortune 500 company, given the opportunity size, delivery risk, and readiness implications.',
      'I suggest we address this in four parts: Clarify what this engagement would require. Assess the upside. Identify the risks. Decide whether to say yes, say yes with conditions, or decline strategically.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: [
      'Joining us today:',
    ],
  },
];

const advisorIntros = [
  {
    name: 'Monica Patel',
    title: 'Finance Advisor',
    bio: 'Former CFO for multiple venture-backed services firms. Focuses on revenue quality, risk-adjusted upside, and pricing structure.',
  },
  {
    name: 'Sarah Klein',
    title: 'Enterprise Client Advisor',
    bio: 'Former Head of Leadership Development for a Fortune 100 company. Understands what corporate clients expect once contracts are signed.',
  },
  {
    name: 'David Morales',
    title: 'Founder-Operator Advisor',
    bio: 'Built and scaled a founder-led consulting firm from workshops into retained enterprise programs. Focuses on delivery capacity and founder sustainability.',
  },
];

const boardroomDialogue: DialogueEntry[] = [
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: ['Sarah — from the buyer side, when a Fortune 500 company says "six-month executive leadership program," what do founders underestimate?'],
  },
  {
    speaker: 'Sarah',
    role: 'Enterprise',
    lines: [
      'The biggest underestimation is consistency and infrastructure.',
      'Fortune 500 clients are not buying inspiration. They are buying reliability.',
      'They expect you to show up the same way in month six as you do in month one. They also expect depth — a six-month program is judged on whether executives actually change behavior.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: ['David, what breaks first?'],
  },
  {
    speaker: 'David',
    role: 'Operator',
    lines: [
      'The founder breaks first. Not the content.',
      'In workshops, the founder is the product. In a six-month engagement, the founder becomes the system. That\'s a massive identity shift.',
      'If everything still routes through you, the risk isn\'t just failure. It\'s exhaustion and resentment.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: ['Monica, what do you listen for?'],
  },
  {
    speaker: 'Monica',
    role: 'Finance',
    lines: [
      'I listen for asymmetry. High revenue does not automatically mean high-quality revenue.',
      'Six-month enterprise contracts come with hidden costs. Customization, stakeholder meetings, reporting, scope creep — all of that erodes margin.',
      'If this is priced like six workshops stitched together, that\'s a problem. This needs to be priced as a transformation program with buffers.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: ['John, let me pause here. As you hear this, what feels most true so far?'],
  },
  {
    speaker: 'John',
    isUser: true,
    lines: [
      'I\'m worried about overcommitting and underdelivering. My reputation is everything. But I also know saying no is how people stay small forever.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: ['That tension you just named is the real decision.'],
  },
  {
    speaker: 'Monica',
    role: 'Finance',
    lines: [
      'I\'ll be direct. Staying small is not caused by saying no. Staying small is caused by saying yes to the wrong structure.',
      'The question is not "am I ready?" The question is "can this be structured so failure is unlikely?"',
      'You do not accept this as a blank check engagement. You accept it as a phased commitment with explicit checkpoints and exit ramps.',
    ],
  },
  {
    speaker: 'Sarah',
    role: 'Enterprise',
    lines: [
      'They do not expect perfection. They expect professionalism and honesty.',
      'What destroys trust is not inexperience. It\'s overpromising confidence you don\'t yet have.',
      'If you position this as "we\'re building something together," you reduce the reputational risk dramatically.',
      'If they reached out to you, they already believe you can deliver something meaningful. The danger is pretending you\'re a large firm when you\'re still founder-led. The smartest partners name that reality upfront.',
    ],
  },
  {
    speaker: 'David',
    role: 'Operator',
    lines: [
      'John, I don\'t hear fear of growth. I hear fear of betrayal. Betraying your own standards.',
      'Saying yes does not mean saying yes to everything. It means saying yes to a version you can stand behind.',
      'If the only way this works is you carrying it all, you\'re not being brave. You\'re being reckless.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: [
      'You\'re not afraid of the work. You are afraid of an irreversible commitment you can\'t control.',
      'So this isn\'t a yes or no decision. It is whether you redesign the promise.',
    ],
  },
  {
    speaker: 'Monica',
    role: 'Finance',
    lines: [
      'Do not sell six months. Sell a 90-day Phase One with an expansion option.',
      'This caps downside. Proves delivery. Makes continuation mutual.',
      'If they won\'t accept that structure, that tells you something important about the risk profile of the client.',
    ],
  },
  {
    speaker: 'Sarah',
    role: 'Enterprise',
    lines: [
      'Yes. And more than credible — it\'s mature.',
      'Large organizations already think in phases. Pilot, evaluate, scale.',
      'If you present this as intentional design, not hesitation, you gain respect.',
      'This is not "I\'m not sure I can do this." This is "We want to ensure this delivers real transformation before scaling." That language earns respect.',
    ],
  },
  {
    speaker: 'David',
    role: 'Operator',
    lines: [
      'Do not sign anything where your identity is the bottleneck.',
      'If success depends on how you feel in month five, the system is wrong.',
      'Your yes must include permission to build leverage, support, or structure as the program evolves. If you lock yourself into a promise frozen in time, you will resent it. That resentment always leaks into delivery.',
    ],
  },
  {
    speaker: 'Facilitator',
    isFacilitator: true,
    lines: [
      'Here\'s the convergence.',
      'You say yes to the opportunity, but no to an uncontrolled six-month commitment.',
      'You counter with: a phased engagement, clear scope boundaries, and explicit checkpoints.',
      'You are not committing to six months. You are committing to earning the right to continue.',
    ],
  },
  {
    speaker: 'John',
    isUser: true,
    lines: ['Yes. This feels aligned.'],
  },
];

const executiveOutput = {
  summary: 'You will say yes to the opportunity, but not to an uncontrolled six-month commitment. You will counter with a phased engagement that protects delivery quality, preserves your reputation, and allows you to scale with integrity.',
  actions: [
    'Design Phase One as a 90-day pilot (7–10 days)',
    'Define non-negotiable scope boundaries',
    'Build expansion language for months 4–6',
    'Identify where leverage or support may be added',
  ],
  insights: [
    'The real risk was irreversible commitment without control',
    'Enterprise clients value clarity over exaggerated confidence',
    'A phased structure increases credibility',
    'Founder sustainability is a delivery requirement',
  ],
  risks: [
    'Client resists phased structure',
    'Founder remains bottleneck',
    'Undervaluing Phase One',
  ],
  stakeholders: [
    { who: 'Fortune 500 sponsor / HR / L&D leader', strategy: 'Position phased structure as intentional transformation design' },
    { who: 'Senior executive team (participants)', strategy: 'Emphasize behavior change, not inspiration' },
    { who: 'John Lim (internal)', strategy: 'Protect energy, standards, and long-term brand equity' },
  ],
};

const SpeakerBubble = ({ entry }: { entry: DialogueEntry }) => {
  const getBadgeStyle = () => {
    if (entry.isFacilitator) return 'bg-ink text-cream';
    if (entry.isUser) return 'bg-gold/15 text-gold-dark';
    return 'bg-cream-deep text-ink-muted';
  };

  const getRoleLabel = () => {
    if (entry.isFacilitator) return 'Facilitator';
    if (entry.isUser) return 'You';
    return `${entry.speaker} — ${entry.role}`;
  };

  return (
    <div className={`${entry.isFacilitator ? 'pl-0' : entry.isUser ? 'pl-2 border-l-2 border-gold/30' : 'pl-2 border-l border-ink/10'}`}>
      <span className={`inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 mb-1.5 ${getBadgeStyle()}`}>
        {getRoleLabel()}
      </span>
      <div className="space-y-1.5">
        {entry.lines.map((line, i) => (
          <p key={i} className={`text-xs leading-relaxed ${entry.isFacilitator ? 'text-ink font-medium' : entry.isUser ? 'text-ink-muted italic' : 'text-ink-muted'}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

const DecisionProcess = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl text-ink mb-2">
          Full Session Transcript
        </h3>
        <p className="text-xs text-warm-gray mb-6">
          From an actual Galavanteer Boardroom session — unedited
        </p>
      </div>

      {/* Opening */}
      <div className="space-y-4">
        {dialogue.map((entry, i) => (
          <SpeakerBubble key={`open-${i}`} entry={entry} />
        ))}
      </div>

      {/* Advisor introductions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {advisorIntros.map((advisor) => (
          <div key={advisor.name} className="bg-cream p-3 border-l-2 border-gold/30">
            <p className="text-xs font-medium text-ink">{advisor.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-gold-dark mb-1.5">{advisor.title}</p>
            <p className="text-[10px] text-warm-gray leading-relaxed">{advisor.bio}</p>
          </div>
        ))}
      </div>

      {/* Main deliberation */}
      <div className="space-y-4">
        {boardroomDialogue.map((entry, i) => (
          <SpeakerBubble key={`main-${i}`} entry={entry} />
        ))}
      </div>

      {/* Executive Output */}
      <div className="pt-6 border-t border-gold/20 space-y-6">
        <h4 className="font-display text-lg text-ink">Executive Output</h4>

        <div className="pb-5 border-b border-ink/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold text-sm font-display">01</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">Executive Decision Summary</span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">{executiveOutput.summary}</p>
        </div>

        <div className="pb-5 border-b border-ink/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold text-sm font-display">02</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">Action Plan</span>
          </div>
          <div className="text-xs text-ink-muted space-y-1.5">
            {executiveOutput.actions.map((a, i) => (
              <p key={i}>• {a}</p>
            ))}
          </div>
        </div>

        <div className="pb-5 border-b border-ink/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold text-sm font-display">03</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">Key Insights</span>
          </div>
          <div className="text-xs text-ink-muted space-y-1.5">
            {executiveOutput.insights.map((ins, i) => (
              <p key={i}>• {ins}</p>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold text-sm font-display">04</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">Risks</span>
          </div>
          <div className="text-xs text-ink-muted space-y-1.5">
            {executiveOutput.risks.map((r, i) => (
              <p key={i}>• {r}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Facilitator closing */}
      <div className="pt-4 border-t border-ink/5">
        <div className="pl-0">
          <span className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 mb-1.5 bg-ink text-cream">Facilitator</span>
          <p className="text-xs text-ink font-medium leading-relaxed">You are moving forward — but on your terms.</p>
        </div>
      </div>

      {/* Closing line */}
      <div className="pt-4 border-t border-ink/5 text-center">
        <p className="text-[10px] text-warm-gray uppercase tracking-wider">
          Produced via The Winning Moments Boardroom — powered by Galavanteer
        </p>
      </div>
    </div>
  );
};

export default DecisionProcess;
