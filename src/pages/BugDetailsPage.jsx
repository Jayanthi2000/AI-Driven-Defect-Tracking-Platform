import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BUGS_DATA, STATUSES } from "../data/mock/bugsData";
import {
  FileText,
  Download,
  ArrowLeft,
  AlertTriangle,
    Clock,Target,CheckCircle2,MessageSquare,Zap,Users,Send,Image,ChevronDown
} from "lucide-react";

const SEV_COLORS = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};
const STATUS_COLORS = {
  "Open": "bg-red-500/10 text-red-400 border-red-500/20",
  "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Testing": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Resolved": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Closed": "bg-slate-500/10 text-slate-400 border-slate-500/20",
};
const STATUS_ICONS = {
  "Open": AlertTriangle,
  "In Progress": Clock,
  "Testing": Target,
  "Resolved": CheckCircle2,
  "Closed": CheckCircle2,
};

function Avatar({ initials, size = "md", gradient = "from-emerald-400 to-emerald-600" }) {
  const sizes = { sm: "w-6 h-6 text-[9px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-black flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Badge({ children, className }) {
  return <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${className}`}>{children}</span>;
}

function SectionCard({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-[#111318] border border-white/[0.06] rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
        <Icon size={15} className="text-slate-500" />
        <h3 className="text-sm font-bold text-slate-300">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const Icon = STATUS_ICONS[value] || Clock;
  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${STATUS_COLORS[value]}`}>
        <Icon size={12} />
        {value}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }}
            className="absolute top-full mt-1 left-0 z-50 bg-[#1a1f2e] border border-white/10 rounded-xl overflow-hidden shadow-xl min-w-[140px]">
            {STATUSES.map(s => {
              const SIcon = STATUS_ICONS[s] || Clock;
              return (
                <button key={s} onClick={() => { onChange(s); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-white/[0.05] ${s === value ? "text-emerald-400" : "text-slate-400"}`}>
                  <SIcon size={12} />
                  {s}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityTimeline({ activity }) {
  const icons = {
    created: { icon: Zap, color: "text-violet-400 bg-violet-500/10" },
    assigned: { icon: Users, color: "text-blue-400 bg-blue-500/10" },
    status: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    severity: { icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
    comment: { icon: MessageSquare, color: "text-amber-400 bg-amber-500/10" },
  };
  return (
    <div className="space-y-4">
      {activity.map((item, i) => {
        const { icon: Icon, color } = icons[item.type] || icons.comment;
        const initials = item.user.split(" ").map(w => w[0]).join("").slice(0, 2);
        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={13} />
              </div>
              {i < activity.length - 1 && <div className="w-px flex-1 bg-white/[0.05] mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-xs text-slate-300"><span className="font-semibold text-white">{item.user}</span> {item.text}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{new Date(item.time).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CommentsSection({ comments: initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    setComments(prev => [...prev, {
      id: `c${Date.now()}`,
      author: "You",
      avatar: "YO",
      text: text.trim(),
      time: new Date().toISOString(),
      reactions: [],
    }]);
    setText("");
  };

  return (
    <div className="space-y-4">
      {comments.map(c => (
        <div key={c.id} className="flex gap-3">
          <Avatar initials={c.avatar} size="sm" />
          <div className="flex-1 bg-[#1a1f2e] rounded-xl p-3 border border-white/[0.05]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white">{c.author}</span>
              <span className="text-[11px] text-slate-600">{new Date(c.time).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
            {c.reactions?.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {c.reactions.map((r, i) => (
                  <span key={i} className="text-[11px] bg-white/[0.05] rounded-full px-2 py-0.5 flex items-center gap-1">
                    {r.emoji} <span className="text-slate-400">{r.count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <Avatar initials="YO" size="sm" />
        <div className="flex-1 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-200 px-3 py-2 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 transition-colors"
          />
          <button onClick={handleSubmit} disabled={!text.trim()}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AttachmentsSection({ attachments }) {
  const typeIcon = (type) => {
    if (type === "image") return <Image size={16} className="text-blue-400" />;
    if (type === "pdf") return <FilePdf size={16} className="text-red-400" />;
    return <FileText size={16} className="text-slate-400" />;
  };
  if (!attachments?.length) return <p className="text-sm text-slate-500 text-center py-4">No attachments</p>;
  return (
    <div className="space-y-2">
      {attachments.map(att => (
        <div key={att.id} className="flex items-center gap-3 p-3 bg-[#1a1f2e] rounded-xl border border-white/[0.05] hover:border-white/10 transition-colors">
          {typeIcon(att.type)}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{att.name}</p>
            <p className="text-[11px] text-slate-500">{att.size} · {att.uploadedBy}</p>
          </div>
          <button className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10">
            Download
          </button>
        </div>
      ))}
    </div>
  );
}

function AIAnalysisCard({ analysis }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shown, setShown] = useState(true);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/[0.06] via-[#111318] to-violet-500/[0.06] border border-emerald-500/20 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Brain size={13} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold text-slate-300">AI Analysis</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
        <button onClick={runAnalysis}
          className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-300 hover:bg-white/[0.08] transition-colors">
          Re-analyze
        </button>
      </div>
      <div className="p-5 space-y-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="flex gap-1">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: d }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500">AI engine analyzing patterns...</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Root Cause</p>
              <p className="text-sm text-slate-200 leading-relaxed">{analysis?.rootCause || "Analysis pending"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Suggested Fix</p>
              <div className="bg-[#1a1f2e] border border-white/[0.05] rounded-xl p-3">
                <p className="text-xs text-slate-300 font-mono leading-relaxed">{analysis?.suggestedFix || "No suggestion available"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1f2e] rounded-xl p-3 border border-white/[0.05]">
                <p className="text-[10px] text-slate-500 mb-1">Confidence</p>
                <div className="flex items-end gap-1">
                  <p className="text-xl font-bold text-emerald-400">{analysis?.confidence || 0}</p>
                  <p className="text-xs text-slate-500 mb-0.5">%</p>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full mt-1.5">
                  <div className="h-1 bg-emerald-400 rounded-full" style={{ width: `${analysis?.confidence || 0}%` }} />
                </div>
              </div>
              <div className="bg-[#1a1f2e] rounded-xl p-3 border border-white/[0.05]">
                <p className="text-[10px] text-slate-500 mb-1">Est. Time</p>
                <p className="text-xl font-bold text-white">{analysis?.estimatedHours || "?"}<span className="text-xs text-slate-500"> hrs</span></p>
              </div>
              <div className="bg-[#1a1f2e] rounded-xl p-3 border border-white/[0.05]">
                <p className="text-[10px] text-slate-500 mb-1">Similar Bugs</p>
                <p className="text-xl font-bold text-violet-400">{analysis?.similarBugs?.length || 0}</p>
              </div>
            </div>
            {analysis?.recommendedTeam?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended Team</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedTeam.map(name => (
                    <span key={name} className="text-xs bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1 text-slate-300">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BugDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activity");
  const [status, setStatus] = useState(null);

  const bug = BUGS_DATA.find(b => b.id === id);

  if (!bug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Bug not found</h2>
        <p className="text-slate-500 text-sm">The bug "{id}" doesn't exist in the system.</p>
        <button onClick={() => navigate("/dashboard/bugs")}
          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm transition-all hover:bg-emerald-500/20">
          Back to Bugs
        </button>
      </div>
    );
  }

  const currentStatus = status || bug.status;
  const relatedBugs = BUGS_DATA.filter(b => (bug.relatedBugs || []).includes(b.id));

  const tabs = [
    { id: "activity", label: "Activity", count: bug.activity?.length || 0 },
    { id: "comments", label: "Comments", count: bug.comments?.length || 0 },
    { id: "attachments", label: "Attachments", count: bug.attachments?.length || 0 },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate("/dashboard/bugs")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-2">
          <ArrowLeft size={15} /> Back to Bug Management
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">{bug.id}</span>
              <Badge className={SEV_COLORS[bug.severity]}>{bug.severity}</Badge>
              <StatusDropdown value={currentStatus} onChange={setStatus} />
              <span className="text-xs font-bold text-slate-500 bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-full">{bug.priority}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">{bug.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><User size={12} /> Reported by <span className="text-slate-400 ml-1">{bug.reporter}</span></span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(bug.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Tag size={12} /> {bug.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 text-sm border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 px-3 py-2 rounded-xl transition-all">
              <Edit3 size={14} /> Edit
            </button>
            <button onClick={() => navigate("/dashboard/bugs")}
              className="flex items-center gap-1.5 text-sm border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-xl transition-all">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main col */}
        <div className="xl:col-span-2 space-y-5">
          {/* Description */}
          <SectionCard title="Description" icon={FileText}>
            <p className="text-sm text-slate-300 leading-relaxed">{bug.description}</p>
            {bug.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {bug.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-white/[0.04] border border-white/[0.06] text-slate-400 px-2.5 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </SectionCard>

          {/* AI Analysis */}
          <AIAnalysisCard analysis={bug.aiAnalysis} />

          {/* Tabs */}
          <div className="bg-[#111318] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/[0.06]">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative ${activeTab === tab.id ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}>
                  {tab.label}
                  {tab.count > 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.05] text-slate-500"}`}>{tab.count}</span>}
                  {activeTab === tab.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === "activity" && <ActivityTimeline activity={bug.activity || []} />}
              {activeTab === "comments" && <CommentsSection comments={bug.comments} />}
              {activeTab === "attachments" && <AttachmentsSection attachments={bug.attachments} />}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details */}
          <SectionCard title="Details" icon={Tag}>
            <div className="space-y-3">
              {[
                { label: "Category", value: bug.category },
                { label: "Environment", value: bug.environment || "Production" },
                { label: "Version", value: bug.version || "v2.3.1" },
                { label: "Due Date", value: bug.dueDate ? new Date(bug.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Not set" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs text-slate-300 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Assigned Users */}
          <SectionCard title="Assigned Team" icon={Users}>
            <div className="flex items-center gap-3 p-2 bg-[#1a1f2e] rounded-xl border border-white/[0.05]">
              <Avatar initials={bug.assignedTo?.split(" ").map(w => w[0]).join("").slice(0, 2) || "??"}  />
              <div>
                <p className="text-sm font-medium text-white">{bug.assignedTo}</p>
                <p className="text-[11px] text-slate-500">Primary assignee</p>
              </div>
            </div>
            {bug.aiAnalysis?.recommendedTeam?.filter(n => n !== bug.assignedTo).map(name => (
              <div key={name} className="flex items-center gap-3 p-2 mt-2 bg-[#1a1f2e] rounded-xl border border-white/[0.05]">
                <Avatar initials={name.split(" ").map(w => w[0]).join("").slice(0, 2)} gradient="from-violet-400 to-violet-600" />
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-[11px] text-slate-500">AI recommended</p>
                </div>
              </div>
            ))}
          </SectionCard>

          {/* Related Bugs */}
          {relatedBugs.length > 0 && (
            <SectionCard title="Related Bugs" icon={Link2}>
              <div className="space-y-2">
                {relatedBugs.map(rb => (
                  <Link key={rb.id} to={`/dashboard/bug/${rb.id}`}
                    className="flex items-center gap-2 p-2.5 bg-[#1a1f2e] rounded-xl border border-white/[0.05] hover:border-emerald-500/20 transition-colors group">
                    <span className="font-mono text-[11px] text-emerald-400">{rb.id}</span>
                    <span className="text-xs text-slate-400 flex-1 truncate group-hover:text-white transition-colors">{rb.title}</span>
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
