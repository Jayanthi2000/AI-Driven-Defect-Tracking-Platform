import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "For solo developers",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "from-zinc-500 to-zinc-700",
    border: "border-white/10",
    cta: "Start Free",
    ctaStyle:
      "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    features: [
      { label: "AI Credits", value: "500 / month" },
      { label: "Projects", value: "3 projects" },
      { label: "Team Members", value: "1 seat" },
      { label: "Bug Reports", value: "100 / month" },
      { label: "Analytics", value: "Basic" },
      { label: "API Access", value: false },
      { label: "Premium Support", value: false },
    ],
  },

  {
    id: "pro",
    name: "Pro",
    tagline: "Best for growing teams",
    monthlyPrice: 49,
    yearlyPrice: 39,
    color:
      "from-emerald-400 via-emerald-500 to-green-600",
    border: "border-emerald-500/50",
    badge: "Most Popular",
    cta: "Start Pro",
    ctaStyle:
      "bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-black shadow-lg shadow-emerald-500/30",
    features: [
      { label: "AI Credits", value: "25,000 / month" },
      { label: "Projects", value: "Unlimited" },
      { label: "Team Members", value: "25 seats" },
      { label: "Bug Reports", value: "Unlimited" },
      {
        label: "Analytics",
        value: "Advanced AI Insights",
      },
      { label: "API Access", value: true },
      {
        label: "Premium Support",
        value: "Priority Chat",
      },
    ],
  },

  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large organizations",
    monthlyPrice: 199,
    yearlyPrice: 159,
    color:
      "from-emerald-500 to-teal-600",
    border: "border-emerald-500/30",
    cta: "Contact Sales",
    ctaStyle:
      "bg-white/10 hover:bg-white/20 text-white border border-emerald-500/20",
    features: [
      { label: "AI Credits", value: "Unlimited" },
      { label: "Projects", value: "Unlimited" },
      {
        label: "Team Members",
        value: "Unlimited seats",
      },
      { label: "Bug Reports", value: "Unlimited" },
      {
        label: "Analytics",
        value: "Custom Reports",
      },
      {
        label: "API Access",
        value: "Full Access",
      },
      {
        label: "Premium Support",
        value: "Dedicated Manager",
      },
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-4 h-4 text-white/20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function FeatureValue({ value }) {
  if (value === true)
    return <CheckIcon />;

  if (value === false)
    return <XIcon />;

  return (
    <span className="text-sm text-white/70 text-right">
      {value}
    </span>
  );
}

function PricingCard({
  plan,
  yearly,
}) {
  const isPro = plan.id === "pro";

  const price = yearly
    ? plan.yearlyPrice
    : plan.monthlyPrice;

  return (
    <div
      className={`relative rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/[0.03]
      
      ${
        isPro
          ? "scale-105 border-emerald-500/60 shadow-2xl shadow-emerald-500/20"
          : plan.border
      }`}
    >
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-emerald-400 to-green-600 px-4 py-1 text-xs font-bold text-black shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}

      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} mb-6 flex items-center justify-center text-black font-bold`}
      >
        {plan.name[0]}
      </div>

      <h3 className="text-2xl font-bold text-white">
        {plan.name}
      </h3>

      <p className="text-white/50 mt-2">
        {plan.tagline}
      </p>

      <div className="mt-8">
        {price === 0 ? (
          <h2 className="text-5xl font-extrabold text-white">
            Free
          </h2>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-2xl text-white/50">
              $
            </span>

            <span className="text-6xl font-extrabold text-white">
              {price}
            </span>

            <span className="text-white/40 mb-2">
              /mo
            </span>
          </div>
        )}
      </div>

      <button
        className={`w-full mt-8 rounded-2xl py-3 font-semibold transition-all duration-300 ${plan.ctaStyle}`}
      >
        {plan.cta}
      </button>

      <div className="mt-8 space-y-4">
        {plan.features.map((feature) => (
          <div
            key={feature.label}
            className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-4"
          >
            <span className="text-sm text-white/50">
              {feature.label}
            </span>

            <FeatureValue
              value={feature.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [yearly, setYearly] =
    useState(false);

  return (
    <div
      className="min-h-screen overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.18), transparent 40%), #080811",
      }}
    >
      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Pricing
          </div>

          <h1 className="mt-8 text-6xl font-extrabold tracking-tight leading-none">
            Modern pricing for
            <br />

            <span className="bg-gradient-to-r from-emerald-300 to-green-500 bg-clip-text text-transparent">
              modern engineering teams
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
            DefectAI helps teams
            identify, analyze, and fix
            software defects faster
            using AI-powered workflows.
          </p>

          {/* TOGGLE */}
          <div className="mt-10 flex items-center justify-center gap-4">

            <span
              className={`text-sm ${
                !yearly
                  ? "text-white"
                  : "text-white/40"
              }`}
            >
              Monthly
            </span>

            <button
              onClick={() =>
                setYearly(!yearly)
              }
              className={`relative h-7 w-14 rounded-full transition ${
                yearly
                  ? "bg-emerald-500"
                  : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  yearly
                    ? "translate-x-8"
                    : "translate-x-1"
                }`}
              />
            </button>

            <span
              className={`text-sm ${
                yearly
                  ? "text-white"
                  : "text-white/40"
              }`}
            >
              Yearly
            </span>

            {yearly && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* CARDS */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
            />
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-32 max-w-4xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">
              Frequently asked questions
            </h2>

            <p className="mt-4 text-white/50">
              Everything you need to
              know about DefectAI.
            </p>
          </div>

          <div className="space-y-4">

            {[
              {
                q: "Can I upgrade anytime?",
                a: "Yes. You can upgrade or downgrade your plan anytime.",
              },

              {
                q: "Do you offer free trial?",
                a: "Yes. Pro comes with 14 days free trial.",
              },

              {
                q: "Is API included?",
                a: "API access is available in Pro and Enterprise plans.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-semibold">
                  {faq.q}
                </h3>

                <p className="mt-3 text-white/50 leading-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-32 overflow-hidden rounded-[40px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-600/10 p-16 text-center backdrop-blur-xl">

          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative z-10">

            <h2 className="text-5xl font-extrabold leading-tight">
              Ready to build
              <br />

              <span className="bg-gradient-to-r from-emerald-300 to-green-500 bg-clip-text text-transparent">
                bug-free products?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
              Join thousands of
              developers using DefectAI
              to identify software bugs
              instantly with AI.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 px-8 py-4 font-semibold text-black shadow-xl shadow-emerald-500/20 transition hover:scale-105">
                Start Free
              </button>

              <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 font-semibold text-white transition hover:bg-white/[0.08]">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}