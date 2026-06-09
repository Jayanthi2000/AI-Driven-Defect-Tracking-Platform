// ReportBugPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle, AlertTriangle, Eye, EyeOff, ImagePlus, X, Download, ZoomIn } from 'lucide-react';
import { getCurrentUser, getDevelopers } from '../../services/testerService';
import { reportBug } from '../../services/bugWorkflowService';
import {
  GlassCard, PageHeader, GreenButton, GhostButton,
  Input, Textarea, Select
} from '../shared/SharedComponents';

const MODULES = [
  'Authentication', 'Dashboard', 'User Management', 'Billing',
  'Reports', 'Analytics', 'Notifications', 'Settings', 'API',
  'Database', 'Frontend', 'Backend', 'Mobile', 'Other'
];

const ENVIRONMENTS = ['Production', 'Staging', 'Development', 'QA', 'UAT'];
const PRIORITIES = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const ACCEPTED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const INITIAL_FORM = {
  title: '',
  description: '',
  module: '',
  environment: '',
  priority: 'MEDIUM',
  severity: 'MEDIUM',
  stepsToReproduce: '',
  expectedResult: '',
  actualResult: '',
  assignedDeveloperId: '',
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── Screenshot Upload Widget ─────────────────────────────────────────────────
function ScreenshotUpload({ screenshot, onScreenshot, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const processFile = useCallback(async (file) => {
    onError('');
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError('Invalid file type. Please upload PNG, JPG, JPEG, or WEBP.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError(`File too large (${formatBytes(file.size)}). Maximum size is 10 MB.`);
      return;
    }
    try {
      const data = await readAsBase64(file);
      onScreenshot({ name: file.name, size: file.size, type: file.type, data });
    } catch {
      onError('Failed to read file. Please try again.');
    }
  }, [onScreenshot, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!screenshot) return;
    const a = document.createElement('a');
    a.href = screenshot.data;
    a.download = screenshot.name;
    a.click();
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-400">Screenshot (Optional)</label>

      {screenshot ? (
        // Preview state
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {/* Thumbnail row */}
          <div className="flex items-center gap-3 p-3">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group"
            >
              <img
                src={screenshot.data}
                alt="screenshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn size={16} className="text-white" />
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{screenshot.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatBytes(screenshot.size)}</p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <ZoomIn size={11} /> Preview
                </button>
                <span className="text-gray-700">·</span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Download size={11} /> Download
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onScreenshot(null)}
              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
              title="Remove screenshot"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        // Drop zone state
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${dragging
              ? 'border-emerald-500/60 bg-emerald-500/5 scale-[1.01]'
              : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.02]'
            }`}
        >
          <ImagePlus size={20} className={dragging ? 'text-emerald-400' : 'text-gray-600'} />
          <span className="text-xs text-gray-600">
            {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
          </span>
          <span className="text-[10px] text-gray-700">PNG, JPG, JPEG, WEBP · max 10 MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && screenshot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              onClick={() => setLightbox(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-4 z-50 flex flex-col items-center justify-center gap-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-4xl">
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div>
                      <p className="text-sm font-medium text-white">{screenshot.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(screenshot.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <Download size={12} /> Download
                      </button>
                      <button
                        onClick={() => setLightbox(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="p-4 flex items-center justify-center bg-[#0a0a0a] max-h-[70vh] overflow-auto">
                    <img
                      src={screenshot.data}
                      alt={screenshot.name}
                      className="max-w-full max-h-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportBugPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [developers, setDevelopers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedBug, setSubmittedBug] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotError, setScreenshotError] = useState('');

  useEffect(() => {
    setDevelopers(getDevelopers());
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length < 5) e.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.module) e.module = 'Module is required';
    if (!form.environment) e.environment = 'Environment is required';
    if (!form.stepsToReproduce.trim()) e.stepsToReproduce = 'Steps to reproduce are required';
    if (!form.expectedResult.trim()) e.expectedResult = 'Expected result is required';
    if (!form.actualResult.trim()) e.actualResult = 'Actual result is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const bugPayload = { ...form };
    if (screenshot) bugPayload.screenshot = screenshot;
    const bug = reportBug(bugPayload, user);
    setSubmittedBug(bug);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted && submittedBug) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto mt-16 text-center"
      >
        <GlassCard className="p-8 border-emerald-500/20">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Bug Reported!</h2>
          <p className="text-gray-400 text-sm mb-1">Your bug has been submitted successfully.</p>
          <p className="text-emerald-400 font-mono text-sm mb-6">{submittedBug.id}</p>
          <div className="flex gap-3 justify-center">
            <GreenButton onClick={() => navigate(`/tester/bug-details/${submittedBug.id}`)}>
              View Bug
            </GreenButton>
            <GhostButton onClick={() => { setForm(INITIAL_FORM); setScreenshot(null); setSubmitted(false); setSubmittedBug(null); }}>
              Report Another
            </GhostButton>
            <GhostButton onClick={() => navigate('/tester/my-bugs')}>
              My Bugs
            </GhostButton>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Report Bug"
        subtitle="Document a new bug with complete details"
        action={
          <GhostButton onClick={() => setShowPreview(!showPreview)} size="sm">
            {showPreview ? <><EyeOff size={14} className="inline mr-1" />Hide Preview</> : <><Eye size={14} className="inline mr-1" />Preview</>}
          </GhostButton>
        }
      />

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Form */}
        <motion.div layout className="space-y-4">
          {/* Basic Info */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bug size={16} className="text-emerald-400" /> Basic Information
            </h3>
            <Input
              label="Bug Title *"
              placeholder="Brief description of the bug"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              error={errors.title}
            />
            <Textarea
              label="Description *"
              placeholder="Detailed description of the bug..."
              rows={3}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              error={errors.description}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Module *"
                value={form.module}
                onChange={e => handleChange('module', e.target.value)}
                error={errors.module}
              >
                <option value="">Select module</option>
                {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Select
                label="Environment *"
                value={form.environment}
                onChange={e => handleChange('environment', e.target.value)}
                error={errors.environment}
              >
                <option value="">Select environment</option>
                {ENVIRONMENTS.map(e => <option key={e} value={e}>{e}</option>)}
              </Select>
            </div>
          </GlassCard>

          {/* Severity & Priority */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-400" /> Classification
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Priority *</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleChange('priority', p)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        form.priority === p
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Severity *</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SEVERITIES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleChange('severity', s)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        form.severity === s
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Steps & Results */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Reproduction Details</h3>
            <Textarea
              label="Steps to Reproduce *"
              placeholder={"1. Navigate to...\n2. Click on...\n3. Observe that..."}
              rows={4}
              value={form.stepsToReproduce}
              onChange={e => handleChange('stepsToReproduce', e.target.value)}
              error={errors.stepsToReproduce}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Textarea
                label="Expected Result *"
                placeholder="What should happen..."
                rows={3}
                value={form.expectedResult}
                onChange={e => handleChange('expectedResult', e.target.value)}
                error={errors.expectedResult}
              />
              <Textarea
                label="Actual Result *"
                placeholder="What actually happens..."
                rows={3}
                value={form.actualResult}
                onChange={e => handleChange('actualResult', e.target.value)}
                error={errors.actualResult}
              />
            </div>
          </GlassCard>

          {/* Assignment + Screenshot */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Assignment & Attachments</h3>
            <Select
              label="Assign Developer (Optional)"
              value={form.assignedDeveloperId}
              onChange={e => handleChange('assignedDeveloperId', e.target.value)}
            >
              <option value="">Unassigned</option>
              {developers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>

            <ScreenshotUpload
              screenshot={screenshot}
              onScreenshot={setScreenshot}
              onError={setScreenshotError}
            />
            {screenshotError && (
              <p className="text-xs text-red-400 -mt-2">{screenshotError}</p>
            )}
          </GlassCard>

          {/* Submit */}
          <div className="flex gap-3">
            <GreenButton onClick={handleSubmit} disabled={submitting} size="lg" className="flex-1">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit Bug Report'}
            </GreenButton>
            <GhostButton onClick={() => navigate('/tester/my-bugs')} size="lg">
              Cancel
            </GhostButton>
          </div>
        </motion.div>

        {/* Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <GlassCard className="p-4 border-emerald-500/20 sticky top-20">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Live Preview</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-base font-semibold text-white">{form.title || 'Bug Title'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">BUG-PREVIEW</p>
                  </div>
                  <p className="text-sm text-gray-400">{form.description || 'Description will appear here...'}</p>
                  <div className="flex flex-wrap gap-2">
                    {form.module && (
                      <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-400">{form.module}</span>
                    )}
                    {form.environment && (
                      <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-400">{form.environment}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      form.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      form.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      form.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{form.severity} Severity</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      {form.priority} Priority
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">OPEN</span>
                  </div>
                  {form.stepsToReproduce && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Steps to Reproduce</p>
                      <p className="text-xs text-gray-500 whitespace-pre-line">{form.stepsToReproduce}</p>
                    </div>
                  )}
                  {screenshot && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1.5">Screenshot</p>
                      <img
                        src={screenshot.data}
                        alt={screenshot.name}
                        className="w-full rounded-lg border border-white/10 object-cover max-h-32"
                      />
                    </div>
                  )}
                  {form.assignedDeveloperId && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-400">D</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {developers.find(d => d.id === form.assignedDeveloperId)?.name || 'Developer'}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
