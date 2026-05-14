import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import ChatDiscovery from "@/components/ChatDiscovery";
import { ArrowRight, ExternalLink } from "lucide-react";

const openChat = () => {
  const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open chat"]');
  if (btn) btn.click();
  else window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

export interface PartnerLandingProps {
  partner: {
    id: string;
    name: string;
    slug: string | null;
    website: string | null;
    landing_headline: string | null;
    landing_subheadline: string | null;
    landing_bio: string | null;
    landing_bullets: unknown;
    landing_photo_url: string | null;
    landing_logo_url: string | null;
    landing_testimonial: string | null;
    landing_accent_color: string | null;
  };
}

const DEFAULT_ACCENT = "#B8956C";

const PartnerLandingPage: React.FC<PartnerLandingProps> = ({ partner }) => {
  const accent = partner.landing_accent_color || DEFAULT_ACCENT;
  const headline =
    partner.landing_headline ||
    `Work with ${partner.name.split(" ")[0]} — and your own private boardroom.`;
  const subheadline =
    partner.landing_subheadline ||
    "A seat at her table, plus 60+ AI advisors built on the Galavanteer engine.";

  const bullets: string[] = Array.isArray(partner.landing_bullets)
    ? (partner.landing_bullets as string[]).filter(Boolean)
    : [];

  return (
    <>
      <Helmet>
        <title>{partner.name} — Partner | Galavanteer</title>
        <meta name="description" content={subheadline} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {/* Minimal header — partner brand only, no Galavanteer nav */}
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {partner.landing_logo_url ? (
                <img
                  src={partner.landing_logo_url}
                  alt={partner.name}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-base font-semibold tracking-tight">
                  {partner.name}
                </span>
              )}
            </div>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
              >
                {partner.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-4"
                style={{ color: accent }}
              >
                Private partnership
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
                {headline}
              </h1>
              <p className="mt-5 text-lg text-stone-600 leading-relaxed max-w-2xl">
                {subheadline}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Button
                  onClick={openChat}
                  className="h-12 px-6 text-white text-sm font-medium"
                  style={{ backgroundColor: accent }}
                >
                  Start a conversation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <span className="text-xs text-stone-500">
                  Takes 2 minutes. No calendar required.
                </span>
              </div>
            </div>

            {partner.landing_photo_url && (
              <div className="md:justify-self-end">
                <img
                  src={partner.landing_photo_url}
                  alt={partner.name}
                  className="w-[240px] h-[300px] object-cover rounded-md border border-stone-200"
                />
              </div>
            )}
          </div>
        </section>

        {/* Bio + bullets */}
        {(partner.landing_bio || bullets.length > 0) && (
          <section className="max-w-5xl mx-auto px-6 py-10 border-t border-stone-200">
            <div className="grid md:grid-cols-2 gap-10">
              {partner.landing_bio && (
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                    About {partner.name.split(" ")[0]}
                  </h2>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {partner.landing_bio}
                  </p>
                </div>
              )}

              {bullets.length > 0 && (
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                    What you get
                  </h2>
                  <ul className="space-y-3">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-stone-800">
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5"
                          style={{ backgroundColor: accent }}
                        />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {partner.landing_testimonial && (
          <section className="max-w-3xl mx-auto px-6 py-12">
            <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed text-stone-800 text-center">
              &ldquo;{partner.landing_testimonial}&rdquo;
            </blockquote>
          </section>
        )}

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-stone-200">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready when you are.
          </h2>
          <p className="mt-3 text-stone-600">
            Tell {partner.name.split(" ")[0]} a bit about what you're working on.
          </p>
          <Button
            onClick={openChat}
            className="mt-6 h-12 px-6 text-white text-sm font-medium"
            style={{ backgroundColor: accent }}
          >
            Start a conversation
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </section>

        {/* Footer — quiet attribution */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-6 text-center">
            <p className="text-[11px] text-stone-400 tracking-wide">
              Powered by{" "}
              <a
                href="https://galavanteer.com"
                className="text-stone-500 hover:text-stone-700 underline-offset-4 hover:underline"
              >
                Galavanteer
              </a>
            </p>
          </div>
        </footer>

        {/* Always-mounted floating chat (already attribution-aware via cookie) */}
        <ChatDiscovery />
      </div>
    </>
  );
};

export default PartnerLandingPage;
