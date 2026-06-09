import React from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  Zap,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";


/* =========================================================
   FEATURE LIST
========================================================= */

const FEATURE_LIST = [
  {
    icon: Zap,
    text: "AI-powered defect detection & prioritization",
  },

  {
    icon: Shield,
    text: "Enterprise-grade security & compliance",
  },

  {
    icon: BarChart3,
    text: "Real-time analytics and team dashboards",
  },

  {
    icon: Users,
    text: "Seamless developer & tester collaboration",
  },
];

/* =========================================================
   STATS
========================================================= */

const STAT_LIST = [
  {
    value: "10x",
    label: "Faster bug resolution",
  },

  {
    value: "99.9%",
    label: "Uptime SLA",
  },

  {
    value: "2,400+",
    label: "Teams worldwide",
  },
];

/* =========================================================
   AUTH LAYOUT
========================================================= */

export default function AuthLayout({
  children,
  panelTitle,
  panelSubtitle,
}) {
  return (
    <div
      className="
        relative flex min-h-screen
        flex-col overflow-hidden
        bg-charcoal-950
        lg:flex-row
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-grid-pattern
          opacity-100
        "
      />

      <div
        className="
          absolute left-[-120px] top-[-200px]
          h-[500px] w-[500px]
          rounded-full
          bg-emerald-500/10
          blur-3xl
        "
      />

      <div
        className="
          absolute bottom-[-200px] right-[-120px]
          h-[500px] w-[500px]
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div
        className="
          relative z-10 hidden
          overflow-hidden
          border-r border-white/5
          lg:flex lg:w-1/2
        "
      >
        <div
          className="
            flex h-full flex-col
            justify-between
            px-16 py-14
          "
        >
          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-emerald-400
                to-emerald-600
              "
            >
              <Zap
                size={18}
                className="text-black"
                fill="currentColor"
              />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Defect
              <span className="text-emerald-400">
                AI
              </span>
            </h1>
          </Link>

          {/* CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-xl"
          >
            <div className="mb-10">
              <span
                className="
                  mb-6 inline-flex
                  rounded-full
                  border border-emerald-500/20
                  bg-emerald-500/10
                  px-4 py-2
                  text-sm font-medium
                  text-emerald-400
                "
              >
                Trusted by 2,400+ teams
              </span>

              <h2
                className="
                  mb-6 text-5xl
                  font-bold leading-tight
                  text-white
                "
              >
                {panelTitle ||
                  "The smartest way to track software defects"}
              </h2>

              <p
                className="
                  text-lg leading-relaxed
                  text-gray-400
                "
              >
                {panelSubtitle ||
                  "AI-driven analysis, real-time collaboration, and enterprise-grade insights — all in one platform."}
              </p>
            </div>

            {/* FEATURES */}

            <div className="mb-10 space-y-4">
              {FEATURE_LIST.map(
                (
                  {
                    icon: Icon,
                    text,
                  },
                  index
                ) => (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="
                        flex h-10 w-10
                        shrink-0 items-center justify-center
                        rounded-xl
                        border border-emerald-500/20
                        bg-emerald-500/10
                      "
                    >
                      <Icon
                        size={18}
                        className="text-emerald-400"
                      />
                    </div>

                    <p className="text-gray-300">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* STATS */}

            <div className="grid grid-cols-3 gap-5">
              {STAT_LIST.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      rounded-2xl
                      border border-white/10
                      bg-white/5
                      p-5
                      text-center
                      backdrop-blur-xl
                    "
                  >
                    <h3
                      className="
                        text-2xl font-bold
                        text-emerald-400
                      "
                    >
                      {item.value}
                    </h3>

                    <p
                      className="
                        mt-1 text-sm
                        text-gray-400
                      "
                    >
                      {item.label}
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* TESTIMONIAL */}

          <div
            className="
              max-w-lg
              rounded-2xl
              border border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
            "
          >
            <p
              className="
                italic leading-relaxed
                text-gray-300
              "
            >
              "DefectAI reduced our bug resolution time by 68% in the first month."
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  bg-violet-600
                  font-bold text-white
                "
              >
                S
              </div>

              <div>
                <h4
                  className="
                    text-sm font-semibold
                    text-white
                  "
                >
                  Sarah Chen
                </h4>

                <p
                  className="
                    text-xs text-gray-500
                  "
                >
                  VP Engineering
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div
        className="
          relative z-10
          flex flex-1
          items-center justify-center
          px-4 py-24
          sm:px-6
          lg:px-10
        "
      >
        {/* MOBILE LOGO */}

        <div
          className="
            absolute left-6 top-6
            lg:hidden
          "
        >
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-emerald-400
                to-violet-500
              "
            >
              <Zap
                size={18}
                className="text-black"
                fill="currentColor"
              />
            </div>

            <span
              className="
                text-xl font-bold
                text-white
              "
            >
              DefectAI
            </span>
          </Link>
        </div>

        {/* FORM */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            w-full
            max-w-md
          "
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}