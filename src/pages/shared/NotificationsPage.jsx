import React from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Bug,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "bug",
    title: "Critical Bug Detected",
    message:
      "AI identified a payment gateway failure in production.",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "success",
    title: "Bug Fixed",
    message:
      "Login authentication issue marked as resolved.",
    time: "10 mins ago",
  },
  {
    id: 3,
    type: "warning",
    title: "High Memory Usage",
    message:
      "Server memory crossed 85% threshold.",
    time: "30 mins ago",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] p-6 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-500/10 p-3">
          <Bell className="h-6 w-6 text-emerald-400" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-slate-400">
            AI alerts, bug activity & system updates
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-5">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-emerald-500/30"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1">
                {item.type === "bug" && (
                  <Bug className="h-5 w-5 text-red-400" />
                )}

                {item.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}

                {item.type === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {item.title}
                  </h2>

                  <span className="text-xs text-slate-500">
                    {item.time}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {item.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}