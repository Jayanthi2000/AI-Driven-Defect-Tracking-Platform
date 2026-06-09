import { useEffect, useState } from "react";
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Menu,
  X,
  Bot,
  Bug,
  LayoutDashboard,
  Terminal,
  Database,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    title: "Getting Started",
    links: [
      {
        id: "introduction",
        label: "Introduction",
      },
      {
        id: "installation",
        label: "Installation",
      },
      {
        id: "quick-start",
        label: "Quick Start",
      },
    ],
  },

  {
    title: "AI Features",
    links: [
      {
        id: "ai-chat",
        label: "AI Chat",
      },
      {
        id: "bug-analysis",
        label: "Bug Analysis",
      },
      {
        id: "severity-detection",
        label: "Severity Detection",
      },
    ],
  },

  {
    title: "Dashboard",
    links: [
      {
        id: "bug-management",
        label: "Bug Management",
      },
      {
        id: "analytics",
        label: "Analytics",
      },
      {
        id: "team-workflow",
        label: "Team Workflow",
      },
    ],
  },

  {
    title: "API",
    links: [
      {
        id: "authentication",
        label: "Authentication",
      },
      {
        id: "endpoints",
        label: "Endpoints",
      },
      {
        id: "rate-limits",
        label: "Rate Limits",
      },
    ],
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:bg-white/[0.08]"
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  );
}

function CodeBlock({
  title,
  code,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D1117] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <p className="text-sm font-medium text-white/70">
          {title}
        </p>

        <CopyButton text={code} />
      </div>

      <pre className="overflow-x-auto p-6 text-sm leading-7 text-emerald-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ApiCard({
  icon,
  title,
  desc,
}) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-2xl">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-white/50">
        {desc}
      </p>
    </div>
  );
}

export default function DocsPage() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("introduction");

  const scrollToSection = (
    sectionId
  ) => {
    const el =
      document.getElementById(
        sectionId
      );

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setActiveSection(sectionId);

      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections =
        document.querySelectorAll(
          "section[id]"
        );

      sections.forEach((sec) => {
        const top =
          window.scrollY;

        const offset =
          sec.offsetTop - 140;

        const height =
          sec.offsetHeight;

        if (
          top >= offset &&
          top <
            offset + height
        ) {
          setActiveSection(sec.id);
        }
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* GRID */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize:
            "50px 50px",
        }}
      />

      <div className="relative z-10 flex">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="fixed left-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0B1220] text-white backdrop-blur-xl lg:hidden"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        {/* SIDEBAR */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-[290px] border-r border-white/[0.06] bg-[#070B18]/95 backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto p-8">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-bold text-black shadow-lg shadow-emerald-500/20">
                D
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  DefectAI
                </h2>

                <p className="text-xs text-white/40">
                  Documentation
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative mt-8">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                placeholder="Search docs..."
                className="h-12 w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] pl-12 pr-4 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* NAVIGATION */}
            <div className="mt-10 space-y-8">
              {SIDEBAR_ITEMS.map(
                (section) => (
                  <div
                    key={
                      section.title
                    }
                  >
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                      {
                        section.title
                      }
                    </h4>

                    <div className="space-y-2">
                      {section.links.map(
                        (
                          item
                        ) => (
                          <button
                            key={
                              item.id
                            }
                            onClick={() =>
                              scrollToSection(
                                item.id
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                              activeSection ===
                              item.id
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                            }`}
                          >
                            {
                              item.label
                            }

                            <ChevronRight
                              size={
                                14
                              }
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12">
            {/* HERO */}
            <section id="introduction">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  Docs
                </div>

                <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                  Build faster with
                  <br />

                  <span className="bg-gradient-to-r from-emerald-300 to-green-500 bg-clip-text text-transparent">
                    AI-powered bug
                    tracking
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
                  Learn how to
                  integrate,
                  manage, and
                  automate bug
                  tracking workflows
                  using DefectAI.
                </p>
              </div>
            </section>

            {/* INSTALLATION */}
            <section
              id="installation"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Installation
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                Install DefectAI
                and start using
                AI-powered bug
                workflows in
                minutes.
              </p>

              <div className="mt-10">
                <CodeBlock
                  title="Install DefectAI"
                  code={`npm install defectai`}
                />
              </div>
            </section>

            {/* QUICK START */}
            <section
              id="quick-start"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Quick Start
              </h2>

              <div className="mt-10">
                <CodeBlock
                  title="Initialize SDK"
                  code={`import { DefectAI } from "defectai";

const ai = new DefectAI({
  apiKey: "YOUR_API_KEY"
});

ai.analyzeBug({
  description: "Login page crashes"
});`}
                />
              </div>
            </section>

            {/* AI CHAT */}
            <section
              id="ai-chat"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                AI Chat Assistant
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                Talk naturally with
                DefectAI and receive
                instant debugging
                suggestions.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <ApiCard
                  icon={
                    <Bot
                      size={22}
                    />
                  }
                  title="AI Responses"
                  desc="Receive intelligent AI-generated debugging suggestions instantly."
                />

                <ApiCard
                  icon={
                    <Bug
                      size={22}
                    />
                  }
                  title="Bug Detection"
                  desc="Automatically classify and identify software defects."
                />

                <ApiCard
                  icon={
                    <LayoutDashboard
                      size={22}
                    />
                  }
                  title="Dashboard Sync"
                  desc="Store all AI-analyzed bugs directly in your dashboard."
                />
              </div>
            </section>

            {/* BUG ANALYSIS */}
            <section
              id="bug-analysis"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Bug Analysis
              </h2>

              <div className="mt-10">
                <CodeBlock
                  title="Analyze Bug"
                  code={`const result = await ai.analyzeBug({
  description: "Checkout page loading slowly"
});

console.log(result.severity);
console.log(result.suggestions);`}
                />
              </div>
            </section>

            {/* SEVERITY */}
            <section
              id="severity-detection"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Severity Detection
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                DefectAI can detect
                high, medium, and
                low severity issues
                using AI models.
              </p>
            </section>

            {/* BUG MANAGEMENT */}
            <section
              id="bug-management"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Bug Management
              </h2>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <ApiCard
                  icon={
                    <Database
                      size={22}
                    />
                  }
                  title="Bug Storage"
                  desc="Store all AI-analyzed defects securely in your dashboard."
                />

                <ApiCard
                  icon={
                    <Terminal
                      size={22}
                    />
                  }
                  title="Workflow Automation"
                  desc="Automate defect workflows using CI/CD integrations."
                />
              </div>
            </section>

            {/* ANALYTICS */}
            <section
              id="analytics"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Analytics
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                Monitor project
                performance, defect
                trends, and AI
                insights using the
                dashboard analytics
                system.
              </p>
            </section>

            {/* TEAM */}
            <section
              id="team-workflow"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Team Workflow
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                Collaborate with
                developers, QA
                engineers, and
                product teams in
                real-time.
              </p>
            </section>

            {/* AUTH */}
            <section
              id="authentication"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Authentication
              </h2>

              <div className="mt-10">
                <CodeBlock
                  title="API Authentication"
                  code={`fetch("/api/analyze", {
  method: "POST",
  headers: {
    Authorization: "Bearer API_KEY"
  }
});`}
                />
              </div>
            </section>

            {/* ENDPOINTS */}
            <section
              id="endpoints"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                API Endpoints
              </h2>

              <div className="mt-10">
                <CodeBlock
                  title="POST /api/analyze"
                  code={`POST /api/analyze

{
  "description": "Login page crashes"
}`}
                />
              </div>
            </section>

            {/* RATE LIMITS */}
            <section
              id="rate-limits"
              className="mt-28"
            >
              <h2 className="text-4xl font-bold">
                Rate Limits
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-white/50">
                Free plan supports
                100 requests/hour.
                Pro and Enterprise
                plans support higher
                API throughput.
              </p>
            </section>

            {/* CTA */}
            <section className="mt-32">
              <div className="relative overflow-hidden rounded-[40px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-600/10 p-16">
                <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

                <div className="relative z-10 text-center">
                  <h2 className="text-5xl font-extrabold leading-tight">
                    Ready to build
                    <br />

                    <span className="bg-gradient-to-r from-emerald-300 to-green-500 bg-clip-text text-transparent">
                      bug-free
                      software?
                    </span>
                  </h2>

                  <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
                    Start using
                    DefectAI and
                    automate your
                    workflows today.
                  </p>

                  <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 px-8 py-4 font-semibold text-black shadow-xl shadow-emerald-500/20 transition hover:scale-105">
                      Get Started
                    </button>

                    <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 font-semibold text-white transition hover:bg-white/[0.08]">
                      View API Docs
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <div className="mt-20 border-t border-white/[0.06] pt-8 text-center text-sm text-white/30">
              © 2025 DefectAI · AI
              Bug Tracking Platform
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}