import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Zap,
} from "lucide-react";

const insights = [
  {
    title:
      "Critical defect probability increased",
    desc:
      "AI detected a 32% spike in authentication failures.",
    icon: ShieldAlert,
    color:
      "text-red-400",
    bg:
      "bg-red-500/10",
  },

  {
    title:
      "Sprint velocity improving",
    desc:
      "Bug resolution speed improved by 18% this week.",
    icon: TrendingUp,
    color:
      "text-emerald-400",
    bg:
      "bg-emerald-500/10",
  },

  {
    title:
      "AI auto-triage active",
    desc:
      "Machine learning successfully categorized 142 new defects.",
    icon: Brain,
    color:
      "text-violet-400",
    bg:
      "bg-violet-500/10",
  },
];

export default function AIInsightsPanel() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            AI Insights
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Machine learning predictions & analysis
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
          <Sparkles
            size={20}
            className="text-violet-400"
          />
        </div>

      </div>

      {/* AI SCORE */}

      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-400">
              AI Prediction Accuracy
            </p>

            <h3 className="mt-1 text-4xl font-bold text-white">
              99.2%
            </h3>

          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">

            <Zap
              size={28}
              className="text-emerald-400"
            />

          </div>

        </div>

      </div>

      {/* INSIGHTS */}

      <div className="space-y-4">

        {insights.map(
          (
            insight,
            index
          ) => {
            const Icon =
              insight.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.04]"
              >

                <div className="flex items-start gap-4">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${insight.bg}`}
                  >

                    <Icon
                      size={18}
                      className={
                        insight.color
                      }
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      {insight.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {insight.desc}
                    </p>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>
    </div>
  );
}