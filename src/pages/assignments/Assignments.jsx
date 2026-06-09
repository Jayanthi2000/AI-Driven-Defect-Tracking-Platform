// FILE: src/pages/Assignments.jsx

import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { getStore } from "../data/store";
import { Avatar } from "../components/ui/Avatar";

export default function Assignments() {
  const bugs = getStore("bugs");
  const team = getStore("team");

  const assigned = bugs.filter((b) => b.assignee);
  const unassigned = bugs.filter((b) => !b.assignee);

  const stats = [
    {
      label: "Total Assigned",
      value: assigned.length,
      icon: ClipboardList,
      color: "var(--accent)",
      badge: "badge-blue",
    },
    {
      label: "Unassigned",
      value: unassigned.length,
      icon: AlertTriangle,
      color: "var(--amber)",
      badge: "badge-amber",
    },
    {
      label: "Resolved",
      value: bugs.filter((b) => b.status === "resolved").length,
      icon: CheckCircle,
      color: "var(--green)",
      badge: "badge-green",
    },
  ];

  return (
    <div
      className="page-enter"
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
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
            Assignments
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            Track developer workload, assigned issues, and resolution flow.
          </p>
        </div>

        <button className="btn-primary">
          <ClipboardList size={16} />
          <span style={{ marginLeft: 8 }}>Create Assignment</span>
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card"
              style={{
                padding: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.03), transparent)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
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
                      marginBottom: 10,
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    className="font-display"
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                </div>

                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Icon size={20} color={item.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 18,
        }}
      >
        {/* TEAM ASSIGNMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card"
          style={{
            padding: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Team Assignments
              </h3>

              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Developer workload overview
              </p>
            </div>

            <span className="badge badge-blue">
              {team.length} members
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {team.map((member) => {
              const memberBugs = bugs.filter(
                (b) => b.assignee === member.name
              );

              const open = memberBugs.filter(
                (b) => b.status === "open"
              ).length;

              const inProgress = memberBugs.filter(
                (b) => b.status === "in-progress"
              ).length;

              const resolved = memberBugs.filter(
                (b) => b.status === "resolved"
              ).length;

              return (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <Avatar
                    initials={member.avatar}
                    size={42}
                    status={member.status}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {member.name}
                      </span>

                      <span className="badge badge-gray">
                        {member.role}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      Productivity Score • {member.productivity}%
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    {open > 0 && (
                      <span className="badge badge-amber">
                        {open} Open
                      </span>
                    )}

                    {inProgress > 0 && (
                      <span className="badge badge-blue">
                        {inProgress} Active
                      </span>
                    )}

                    {resolved > 0 && (
                      <span className="badge badge-green">
                        {resolved} Done
                      </span>
                    )}

                    {memberBugs.length === 0 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        No assignments
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* UNASSIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card"
          style={{
            padding: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Unassigned Bugs
              </h3>

              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Pending ownership allocation
              </p>
            </div>

            <span className="badge badge-amber">
              {unassigned.length} pending
            </span>
          </div>

          {unassigned.length === 0 ? (
            <div
              style={{
                padding: 60,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  margin: "0 auto 16px",
                  background: "rgba(16,185,129,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle
                  size={32}
                  color="var(--green)"
                />
              </div>

              <h4
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                }}
              >
                Everything Assigned
              </h4>

              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                }}
              >
                All bugs currently have assigned owners.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {unassigned.map((bug) => (
                <motion.div
                  key={bug.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          className="font-mono"
                          style={{
                            fontSize: 12,
                            color: "var(--accent)",
                          }}
                        >
                          {bug.id}
                        </span>

                        <span
                          className={`badge ${
                            bug.severity === "critical"
                              ? "badge-red"
                              : bug.severity === "high"
                              ? "badge-amber"
                              : "badge-gray"
                          }`}
                        >
                          {bug.severity}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 6,
                        }}
                      >
                        {bug.title}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {bug.description}
                      </div>
                    </div>

                    <button className="btn-ghost">
                      Assign
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}