import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Check, X } from "lucide-react";

const OnePager = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FDFBF7" }}>
      <SEOHead
        title="The Roundtable: Complete Overview | Galavanteer"
        description="Everything you need to know about The Roundtable in one place."
        canonicalUrl="https://galavanteer.com/one-pager"
      />

      <Header />

      {/* Enhanced animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .level-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .level-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(184, 149, 108, 0.15);
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(184, 149, 108, 0.4);
        }
      `}</style>

      <main className="flex-1">
        {/* Hero / Overview - Dramatically Enhanced */}
        <section
          className="relative overflow-hidden py-24 lg:py-32"
          style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #F9F6F0 100%)" }}
        >
          {/* Golden thread with glow */}
          <div
            className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-gold/40"
            style={{ boxShadow: "0 0 20px rgba(184, 149, 108, 0.15)" }}
          />

          {/* Subtle radial gradient */}
          <div
            className="absolute top-0 right-0 w-2/3 h-full opacity-[0.04]"
            style={{
              background: "radial-gradient(ellipse at 70% 20%, #B8956C 0%, transparent 60%)",
            }}
          />

          <div className="container relative">
            <div className="lg:pl-12 max-w-5xl">
              <div
                className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
              >
                <div className="w-16 h-px bg-gradient-to-r from-gold/70 to-gold-light/50" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "#B8956C" }}>
                  Complete Overview
                </span>
              </div>

              {/* Massive headline */}
              <h1
                className="font-display font-light mb-6 opacity-0 animate-fade-in-up"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                  color: "#1A1915",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                The Roundtable
              </h1>

              {/* Refined subhead */}
              <p
                className="text-[20px] leading-loose max-w-3xl mb-16 opacity-0 animate-fade-in-up"
                style={{
                  color: "#3D3830",
                  lineHeight: 1.7,
                  animationDelay: "0.3s",
                  animationFillMode: "forwards",
                }}
              >
                Your personal boardroom meeting, on-demand. 60+ expert personas debate your challenge, argue with each
                other, and tell you what you're missing.
              </p>

              {/* Enhanced stat cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { number: "60+", label: "Expert personas", delay: "0.4s" },
                  { number: "4", label: "Levels", delay: "0.5s" },
                  { number: "10", label: "Day trial", delay: "0.6s" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="stat-card bg-white p-8 border border-gold/10 opacity-0 animate-scale-in relative overflow-hidden"
                    style={{ animationDelay: stat.delay, animationFillMode: "forwards" }}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    <div className="relative">
                      <div
                        className="text-5xl font-display font-light mb-3"
                        style={{ color: "#B8956C", letterSpacing: "-0.02em" }}
                      >
                        {stat.number}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#5C554A", lineHeight: 1.7 }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What It Is - Refined Layout */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#F9F6F0" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container">
            <div className="lg:pl-12 max-w-6xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#1A1915",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                What it is
              </h2>

              <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7 space-y-8">
                  <p className="text-[19px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                    The Roundtable is a system for examining decisions before you commit to them.
                  </p>
                  <p className="text-[19px] leading-loose" style={{ color: "#3D3830", lineHeight: 1.8 }}>
                    You bring a challenge. 60+ expert personas (CFOs, operators, sales leaders, coaches, legal advisors)
                    debate it from every angle. They argue with each other. They push back on your assumptions. They
                    surface what you're not seeing.
                  </p>
                  <p className="text-[19px] leading-loose font-medium" style={{ color: "#1A1915", lineHeight: 1.8 }}>
                    Then you get a verdict: what you're really deciding, what you're trading, what you're risking, and
                    what to do.
                  </p>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 border-l-2 border-gold/60 transition-all duration-300 hover:border-gold hover:shadow-lg">
                    <h3 className="text-base font-medium mb-4" style={{ color: "#1A1915" }}>
                      Examination, not advice
                    </h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                      The Roundtable doesn't tell you what to do. It makes you defend your thinking, surfaces blind
                      spots, and shows you the tradeoffs before you commit.
                    </p>
                  </div>

                  <div className="bg-white p-8 border-l-2 border-gold/60 transition-all duration-300 hover:border-gold hover:shadow-lg">
                    <h3 className="text-base font-medium mb-4" style={{ color: "#1A1915" }}>
                      Always available. Never tired.
                    </h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                      Use it once for a major decision or daily for operational thinking. The system scales to your
                      needs without losing quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For - Dark Premium Section */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#1A1915" }}>
          <div
            className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20"
            style={{ boxShadow: "0 0 20px rgba(184, 149, 108, 0.1)" }}
          />

          <div className="container">
            <div className="lg:pl-12 max-w-5xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#FDFBF7",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Who it's for
              </h2>

              <div className="grid md:grid-cols-2 gap-10 mb-16">
                <div className="space-y-6">
                  {[
                    "Founders carrying the weight of every major decision",
                    "Executives who need to defend choices to boards",
                    "Private equity partners evaluating deals",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ background: "rgba(184, 149, 108, 0.2)" }}
                      >
                        <Check className="w-4 h-4" style={{ color: "#D4B896" }} />
                      </div>
                      <p className="text-[17px] leading-relaxed" style={{ color: "#C9C3B8", lineHeight: 1.7 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {[
                    "Non-profit leaders managing high-stakes choices",
                    "Consultants who need structured thinking tools",
                    "Anyone whose decisions affect others",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ background: "rgba(184, 149, 108, 0.2)" }}
                      >
                        <Check className="w-4 h-4" style={{ color: "#D4B896" }} />
                      </div>
                      <p className="text-[17px] leading-relaxed" style={{ color: "#C9C3B8", lineHeight: 1.7 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-10 border border-gold/20 backdrop-blur-sm">
                <p className="text-[19px] leading-loose font-light" style={{ color: "#FDFBF7", lineHeight: 1.8 }}>
                  If you're the person everyone comes to for final decisions, and you're tired of thinking in circles
                  alone, this is built for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Premium Process */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#FDFBF7" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container">
            <div className="lg:pl-12 max-w-5xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#1A1915",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                How it works
              </h2>

              <div className="space-y-12">
                {[
                  {
                    num: "1",
                    title: "Bring your challenge",
                    desc: "Type in the challenge you're facing. Strategic, operational, personal. The Roundtable handles all of it.",
                  },
                  {
                    num: "2",
                    title: "The table debates it",
                    desc: "60+ expert personas examine your challenge from every angle. They argue. They disagree. They push back on assumptions you didn't know you were making.",
                  },
                  {
                    num: "3",
                    title: "You get the verdict",
                    desc: "What the decision really involves. What you're trading off. What risks you're accepting. What to do next.",
                  },
                  {
                    num: "4",
                    title: "You decide",
                    desc: "The Roundtable doesn't make the decision for you. It makes sure you've examined it properly before you commit.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex-shrink-0">
                      <div
                        className="w-16 h-16 flex items-center justify-center bg-gold text-cream font-display text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {step.num}
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-medium mb-3" style={{ color: "#1A1915" }}>
                        {step.title}
                      </h3>
                      <p className="text-[17px] leading-loose max-w-2xl" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The 4 Levels - Enhanced Cards */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#F9F6F0" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container">
            <div className="lg:pl-12 max-w-6xl">
              <h2
                className="font-display font-light mb-8"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#1A1915",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                The four levels
              </h2>

              <p className="text-[17px] leading-loose mb-16 max-w-3xl" style={{ color: "#5C554A", lineHeight: 1.8 }}>
                Each level includes the ones before it. Start at Level 1. Go deeper when you're ready.
              </p>

              <div className="grid lg:grid-cols-4 gap-6">
                {/* Level 1 */}
                <div className="level-card bg-white p-8 border border-gold/15 relative">
                  <div className="absolute -top-3 left-6 bg-gold text-cream text-[10px] font-medium px-3 py-1.5 uppercase tracking-wider">
                    10-day trial
                  </div>
                  <div
                    className="text-5xl font-display font-light mb-6"
                    style={{ color: "#B8956C", letterSpacing: "-0.02em" }}
                  >
                    01
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "#1A1915" }}>
                    The Boardroom
                  </h3>
                  <p
                    className="text-xs uppercase tracking-wider mb-6"
                    style={{ color: "#B8956C", letterSpacing: "0.1em" }}
                  >
                    60+ experts. Any challenge.
                  </p>
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                    Bring a challenge. They debate it. You get the verdict.
                  </p>
                  <p className="text-[15px] font-medium mb-6" style={{ color: "#1A1915" }}>
                    Start here.
                  </p>
                  <div className="pt-6 border-t border-gold/15">
                    <p className="text-xs font-medium mb-2" style={{ color: "#1A1915" }}>
                      Includes work connectors when paid:
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "#7A7368", lineHeight: 1.6 }}>
                      Microsoft Teams, Outlook, SharePoint, GitHub, Slack, Jira, Notion, HubSpot, Asana, Google Drive
                    </p>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="level-card bg-white p-8 border border-gold/15">
                  <div
                    className="text-5xl font-display font-light mb-6"
                    style={{ color: "#B8956C", letterSpacing: "-0.02em" }}
                  >
                    02
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "#1A1915" }}>
                    Operating Frame
                  </h3>
                  <p
                    className="text-xs uppercase tracking-wider mb-6"
                    style={{ color: "#B8956C", letterSpacing: "0.1em" }}
                  >
                    Your company context.
                  </p>
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                    How your company thinks. What you optimize for. What you never compromise on.
                  </p>
                  <p className="text-[15px] font-medium mb-6" style={{ color: "#1A1915" }}>
                    The personas understand your reality.
                  </p>
                  <p className="text-xs italic mt-auto" style={{ color: "#7A7368" }}>
                    Includes Level 1
                  </p>
                </div>

                {/* Level 3 */}
                <div className="level-card bg-white p-8 border border-gold/15 relative">
                  <div className="absolute -top-3 left-6 bg-ink text-cream text-[10px] font-medium px-3 py-1.5 uppercase tracking-wider">
                    Recommended
                  </div>
                  <div
                    className="text-5xl font-display font-light mb-6"
                    style={{ color: "#B8956C", letterSpacing: "-0.02em" }}
                  >
                    03
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "#1A1915" }}>
                    Present Persona
                  </h3>
                  <p
                    className="text-xs uppercase tracking-wider mb-6"
                    style={{ color: "#B8956C", letterSpacing: "0.1em" }}
                  >
                    Your decision style.
                  </p>
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                    Your biases. Your defaults. How you make tradeoffs.
                  </p>
                  <p className="text-[15px] font-medium mb-6" style={{ color: "#1A1915" }}>
                    This is where most people land.
                  </p>
                  <p className="text-xs italic mt-auto" style={{ color: "#7A7368" }}>
                    Includes Levels 1 & 2
                  </p>
                </div>

                {/* Level 4 */}
                <div className="level-card bg-white p-8 border border-gold/15">
                  <div
                    className="text-5xl font-display font-light mb-6"
                    style={{ color: "#B8956C", letterSpacing: "-0.02em" }}
                  >
                    04
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "#1A1915" }}>
                    Future Me
                  </h3>
                  <p
                    className="text-xs uppercase tracking-wider mb-6"
                    style={{ color: "#B8956C", letterSpacing: "0.1em" }}
                  >
                    Who you're becoming.
                  </p>
                  <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                    Five years from now. The patterns you're growing into.
                  </p>
                  <p className="text-[15px] font-medium mb-6" style={{ color: "#1A1915" }}>
                    Decisions measured against your future self.
                  </p>
                  <p className="text-xs italic mt-auto" style={{ color: "#7A7368" }}>
                    Includes Levels 1, 2 & 3
                  </p>
                </div>
              </div>

              <div className="mt-12 space-y-3 text-center">
                <p className="text-xs" style={{ color: "#7A7368", lineHeight: 1.7 }}>
                  Work connectors turn on when you move to a paid plan. All paid tiers need a ChatGPT Teams plan with
                  one seat for data security.
                </p>
                <p className="text-xs" style={{ color: "#7A7368", lineHeight: 1.7 }}>
                  Pricing depends on scope. Every engagement starts with a Clarity Call.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes It Different - Bold Comparison */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#FDFBF7" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container">
            <div className="lg:pl-12 max-w-6xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#1A1915",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                What makes it different
              </h2>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* The Roundtable - Premium highlighting */}
                <div className="bg-gradient-to-br from-gold/5 to-transparent p-10 border-2 border-gold/30">
                  <h3 className="text-2xl font-display font-medium mb-8" style={{ color: "#1A1915" }}>
                    The Roundtable
                  </h3>
                  <div className="space-y-5">
                    {[
                      "60+ expert personas that debate and disagree",
                      "Surfaces blind spots before you commit",
                      "Makes tradeoffs explicit, not hidden",
                      "Structured examination, not generic advice",
                      "Adapts to your context and decision style",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "#B8956C" }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-[15px] leading-relaxed" style={{ color: "#1A1915", lineHeight: 1.7 }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generic AI - Muted */}
                <div className="p-10 border border-ink/10 opacity-60">
                  <h3 className="text-2xl font-display font-medium mb-8" style={{ color: "#1A1915" }}>
                    Generic AI
                  </h3>
                  <div className="space-y-5">
                    {[
                      "One perspective that agrees with you",
                      "No challenge, no pushback",
                      "Answers sound good but miss what matters",
                      "Generic frameworks that ignore your reality",
                      "No understanding of how you actually think",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "#E5E5E5" }}
                        >
                          <X className="w-4 h-4" style={{ color: "#666" }} />
                        </div>
                        <p className="text-[15px] leading-relaxed" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Dark Elegant */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#1A1915" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20" />

          <div className="container">
            <div className="lg:pl-12 max-w-6xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#FDFBF7",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                What people notice
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    quote:
                      "I walk into meetings more prepared and steadier. I can see the next step instead of trying to hold the entire mountain in my head.",
                    name: "Danielle Blanchard",
                    title: "Founder, Diabetes Motivational Coaching",
                  },
                  {
                    quote:
                      "It surfaces the same questions I would ask sitting in the room. It identifies gaps the same way I do.",
                    name: "Private Equity Partner",
                    title: "",
                  },
                  {
                    quote:
                      "The clarity, speed, and insight it delivers has saved me hours and raised the quality of my work.",
                    name: "Rocky Younger",
                    title: "Account Executive",
                  },
                ].map((testimonial, i) => (
                  <div
                    key={i}
                    className="bg-white/5 p-8 border border-gold/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-gold/40"
                  >
                    <p className="font-display italic text-[17px] mb-6" style={{ color: "#FDFBF7", lineHeight: 1.6 }}>
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-gold/20">
                      <p className="text-sm font-medium" style={{ color: "#D4B896" }}>
                        {testimonial.name}
                      </p>
                      {testimonial.title && (
                        <p className="text-xs mt-1" style={{ color: "#A09A90" }}>
                          {testimonial.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center mt-12 italic" style={{ color: "#A09A90" }}>
                Real words from real clients. Shared with permission.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started - Premium CTA Section */}
        <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: "#F9F6F0" }}>
          <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

          <div className="container">
            <div className="lg:pl-12 max-w-5xl">
              <h2
                className="font-display font-light mb-16"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  color: "#1A1915",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Getting started
              </h2>

              <div className="bg-white p-10 border border-gold/20 mb-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-px bg-gold" />
                  <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "#B8956C" }}>
                    The Process
                  </span>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      num: "1",
                      title: "Book a Clarity Call",
                      desc: "30 minutes. No pitch. We'll determine if this is a fit.",
                    },
                    {
                      num: "2",
                      title: "Try the 10-day trial",
                      desc: "Test it with real challenges. See if it changes how you think.",
                    },
                    {
                      num: "3",
                      title: "Choose your level",
                      desc: "Start at Level 1. Go deeper when ready. Most people find their fit at Level 3.",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gold/10 text-gold font-display text-lg">
                        {step.num}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base font-medium mb-2" style={{ color: "#1A1915" }}>
                          {step.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed" style={{ color: "#5C554A", lineHeight: 1.7 }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <a
                  href="https://calendly.com/jason-galavanteer/discovery_call"
                  className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-ink text-cream text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-500 hover:bg-gold hover:shadow-lg group"
                >
                  <span>Book Your Clarity Call</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
                <p className="text-xs mt-6" style={{ color: "#7A7368" }}>
                  30 minutes. No pitch. No pressure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="relative overflow-hidden py-16" style={{ background: "#FDFBF7" }}>
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs leading-relaxed" style={{ color: "#7A7368", lineHeight: 1.8 }}>
                The Roundtable is built by Jason Baron at Galavanteer. Trusted by Fortune 500 Leaders, Private Equity
                Partners, and Non-Profit Executives.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OnePager;
