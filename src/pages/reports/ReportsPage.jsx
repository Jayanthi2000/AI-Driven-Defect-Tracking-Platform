import { motion } from "framer-motion";
import {
  Download,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import { analyticsData, getStore } from "../../data/store";

const reports = [
  {
    id: "RPT-001",
    name: "Sprint 17 Summary",
    type: "Sprint",
    created: "2026-05-28",
    status: "Ready",
  },
  {
    id: "RPT-002",
    name: "Bug Resolution Metrics",
    type: "Analytics",
    created: "2026-05-26",
    status: "Ready",
  },
  {
    id: "RPT-003",
    name: "Team Productivity",
    type: "Performance",
    created: "2026-05-24",
    status: "Generating",
  },
];

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card"
      style={{
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          {title}
        </div>

        <div
          className="font-display"
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} color={color} />
      </div>
    </motion.div>
  );
}

export default function ReportsPage() {
  const bugs = getStore("bugs") || [];

  const resolved = bugs.filter(
    (b) => b.status === "resolved"
  ).length;

  const open = bugs.filter(
    (b) => b.status === "open"
  ).length;

  const critical = bugs.filter(
    (b) => b.severity === "critical"
  ).length;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            className="font-display"
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Reports
          </h1>

          <div
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            Sprint insights, exports & performance metrics
          </div>
        </div>

        <button className="btn-primary">
          <Download size={16} />
          <span>Export Reports</span>
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          title="Resolved Bugs"
          value={resolved}
          icon={CheckCircle2}
          color="#10b981"
        />

        <StatCard
          title="Open Issues"
          value={open}
          icon={AlertTriangle}
          color="#f59e0b"
        />

        <StatCard
          title="Critical Bugs"
          value={critical}
          icon={Clock}
          color="#ef4444"
        />

        <StatCard
          title="Velocity Growth"
          value="+18%"
          icon={TrendingUp}
          color="#3b82f6"
        />
      </div>

      {/* Sprint Cards */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          padding: 22,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              className="font-display"
              style={{
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Sprint Performance
            </div>

            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Latest sprint completion overview
            </div>
          </div>

          <ArrowUpRight
            size={18}
            color="var(--text-muted)"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(160px,1fr))",
            gap: 16,
          }}
        >
          {analyticsData.sprintVelocity.map((sprint) => (
            <div
              key={sprint.sprint}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                {sprint.sprint}
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                {sprint.completed}/{sprint.planned}
              </div>

              <div
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "var(--bg-card)",
                }}
              >
                <div
                  style={{
                    width: `${
                      (sprint.completed /
                        sprint.planned) *
                      100
                    }%`,
                    height: "100%",
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
        style={{
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="font-display"
              style={{
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Generated Reports
            </div>

            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Download exports and summaries
            </div>
          </div>

          <FileText
            size={18}
            color="var(--text-muted)"
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--bg-elevated)",
                }}
              >
                {[
                  "ID",
                  "Report",
                  "Type",
                  "Created",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      padding: "14px 18px",
                      textAlign: "left",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  style={{
                    borderTop:
                      "1px solid var(--border)",
                  }}
                >
                  <td
                    className="font-mono"
                    style={{
                      padding: "16px 18px",
                      fontSize: 12,
                      color: "var(--accent)",
                    }}
                  >
                    {report.id}
                  </td>

                  <td
                    style={{
                      padding: "16px 18px",
                      fontSize: 14,
                      color: "var(--text-primary)",
                    }}
                  >
                    {report.name}
                  </td>

                  <td
                    style={{
                      padding: "16px 18px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {report.type}
                  </td>

                  <td
                    style={{
                      padding: "16px 18px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {report.created}
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <span
                      className={`badge ${
                        report.status === "Ready"
                          ? "badge-green"
                          : "badge-amber"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <button className="btn-ghost">
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}