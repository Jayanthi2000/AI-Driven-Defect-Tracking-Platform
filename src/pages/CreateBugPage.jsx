import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, AlertTriangle, Brain, ChevronDown } from "lucide-react";
import { CATEGORIES, SEVERITIES, STATUSES, PRIORITIES, TEAM_MEMBERS } from "../data/mock/bugsData";

const ENVIRONMENTS = ["Development", "Staging", "Production", "UAT"];

function FormGroup({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-200 px-4 py-3 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors ${className}`}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-200 px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500/40 transition-colors cursor-pointer">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}

const SEV_LABELS = { Critical: "🔴", High: "🟠", Medium: "🟡", Low: "🟢" };
const PRI_COLORS = { P1: "border-red-500/40 bg-red-500/10 text-red-400", P2: "border-orange-500/40 bg-orange-500/10 text-orange-400", P3: "border-amber-500/40 bg-amber-500/10 text-amber-400", P4: "border-slate-500/40 bg-slate-500/10 text-slate-400" };

export default function CreateBugPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", severity: "", priority: "", status: "Open",
    category: "", assignedTo: "", environment: "Production", version: "", tags: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const set = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.severity) e.severity = "Select a severity";
    if (!form.priority) e.priority = "Select a priority";
    if (!form.category) e.category = "Select a category";
    return e;
  };

  const handleAISuggest = () => {
    if (!form.title.trim()) return;
    setAiSuggesting(true);
    setTimeout(() => {
      setAiSuggestion({
        severity: "High",
        priority: "P2",
        category: "Authentication",
        confidence: 87,
        rootCause: "Based on the title, this appears to be an authentication-related bug affecting token handling.",
      });
      setAiSuggesting(false);
    }, 2000);
  };

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;
    setForm(p => ({ ...p, severity: aiSuggestion.severity, priority: aiSuggestion.priority, category: aiSuggestion.category }));
    setAiSuggestion(null);
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(() => navigate("/dashboard/bugs"), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Plus size={28} className="text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-white">Bug Created!</h2>
        <p className="text-slate-400 text-sm">Redirecting to bug list...</p>
      </div>
    );
  }
const handleSubmit = () => {
  const e = validate();

  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  const currentUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const bugs =
    JSON.parse(localStorage.getItem("bugs")) || [];

  const newBug = {
    id: `BUG-${Date.now()}`,

    title: form.title,
    description: form.description,

    severity: form.severity,
    priority: form.priority,

    status: "Open",

    category: form.category,

    assignedTo: form.assignedTo,

    environment: form.environment,

    version: form.version,

    tags: form.tags,

    reporterId: currentUser.id,

    reporterName: currentUser.name,

    comments: [],

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  bugs.unshift(newBug);

  localStorage.setItem(
    "bugs",
    JSON.stringify(bugs)
  );

  const notifications =
    JSON.parse(
      localStorage.getItem("notifications")
    ) || [];

  notifications.unshift({
    id: Date.now(),

    title: "New Bug Created",

    message: `${newBug.title} has been reported`,

    role: "admin",

    bugId: newBug.id,

    read: false,

    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(
    "notifications",
    JSON.stringify(notifications)
  );

  setSubmitted(true);

  setTimeout(() => {
    navigate("/dashboard/bugs");
  }, 1500);
};
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate("/dashboard/bugs")} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-3">
          <ArrowLeft size={15} /> Back to Bugs
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Bug Report</h1>
        <p className="text-slate-400 text-sm mt-1">Fill in the details below. AI will auto-suggest severity and category.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[#111318] border border-white/[0.06] rounded-2xl p-6 space-y-5">

        {/* Title + AI */}
        <FormGroup label="Bug Title" required>
          <div className="flex gap-2">
            <Input value={form.title} onChange={set("title")} placeholder="e.g. Login API returns 401 on valid credentials" />
            <button onClick={handleAISuggest} disabled={!form.title.trim() || aiSuggesting}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all shrink-0 ${aiSuggesting ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] text-slate-400 hover:border-emerald-500/20 hover:text-emerald-400 hover:bg-emerald-500/10"}`}>
              {aiSuggesting ? (
                <><span className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" /> Thinking...</>
              ) : (
                <><Brain size={12} /> AI Suggest</>
              )}
            </button>
          </div>
          {errors.title && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={11} />{errors.title}</p>}
        </FormGroup>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-400 mb-1">AI Suggestion <span className="font-normal text-slate-500">({aiSuggestion.confidence}% confidence)</span></p>
              <p className="text-xs text-slate-300">Severity: <strong>{aiSuggestion.severity}</strong> · Priority: <strong>{aiSuggestion.priority}</strong> · Category: <strong>{aiSuggestion.category}</strong></p>
              <p className="text-[11px] text-slate-500 mt-1">{aiSuggestion.rootCause}</p>
            </div>
            <button onClick={applyAISuggestion} className="text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-colors shrink-0">
              Apply
            </button>
          </motion.div>
        )}

        {/* Description */}
        <FormGroup label="Description">
          <textarea value={form.description} onChange={e => set("description")(e.target.value)}
            placeholder="Describe the bug in detail. Include steps to reproduce, expected vs actual behavior..."
            rows={4}
            className="w-full bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-200 px-4 py-3 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors resize-none" />
        </FormGroup>

        {/* Grid: severity + priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup label="Severity" required>
            <div className="grid grid-cols-2 gap-2">
              {SEVERITIES.map(s => (
                <button key={s} onClick={() => { set("severity")(s); setErrors(p => ({ ...p, severity: "" })); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.severity === s ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] text-slate-500 hover:border-white/15 hover:text-slate-300"}`}>
                  {SEV_LABELS[s]} {s}
                </button>
              ))}
            </div>
            {errors.severity && <p className="text-xs text-red-400 mt-1">{errors.severity}</p>}
          </FormGroup>

          <FormGroup label="Priority" required>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map(p => (
                <button key={p} onClick={() => { set("priority")(p); setErrors(prev => ({ ...prev, priority: "" })); }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.priority === p ? PRI_COLORS[p] : "border-white/[0.08] text-slate-500 hover:border-white/15"}`}>
                  {p}
                </button>
              ))}
            </div>
            {errors.priority && <p className="text-xs text-red-400 mt-1">{errors.priority}</p>}
          </FormGroup>
        </div>

        {/* Category + Assigned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup label="Category" required>
            <Select value={form.category} onChange={v => { set("category")(v); setErrors(p => ({ ...p, category: "" })); }} options={CATEGORIES} placeholder="Select category" />
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
          </FormGroup>
          <FormGroup label="Assigned To">
            <Select value={form.assignedTo} onChange={set("assignedTo")} options={TEAM_MEMBERS.map(m => m.name)} placeholder="Select assignee" />
          </FormGroup>
        </div>

        {/* Status + Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup label="Status">
            <Select value={form.status} onChange={set("status")} options={STATUSES} placeholder="Select status" />
          </FormGroup>
          <FormGroup label="Environment">
            <Select value={form.environment} onChange={set("environment")} options={ENVIRONMENTS} placeholder="Select env" />
          </FormGroup>
        </div>

        {/* Version + Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup label="Version">
            <Input value={form.version} onChange={set("version")} placeholder="e.g. v2.3.1" />
          </FormGroup>
          <FormGroup label="Tags">
            <Input value={form.tags} onChange={set("tags")} placeholder="e.g. auth, jwt, mobile" />
          </FormGroup>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <button onClick={() => navigate("/dashboard/bugs")}
            className="text-sm text-slate-500 hover:text-white transition-colors px-4 py-2">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
            <Plus size={16} /> Create Bug
          </button>
        </div>
      </motion.div>
    </div>
  );
}
