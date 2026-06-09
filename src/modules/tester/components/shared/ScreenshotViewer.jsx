// ScreenshotViewer.jsx
// Shared component — works in both Tester and Developer BugDetailsPage.
// Place at: src/modules/tester/components/shared/ScreenshotViewer.jsx
// Import path from tester pages:  '../shared/ScreenshotViewer'
// Import path from developer pages: adjust relative path accordingly.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, Download, X, ImageOff } from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ScreenshotViewer({ screenshot }) {
  const [lightbox, setLightbox] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!screenshot?.data) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = screenshot.data;
    a.download = screenshot.name || 'screenshot';
    a.click();
  };

  return (
    <>
      {/* Inline card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Screenshot</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-white transition-colors"
            >
              <Download size={11} /> Download
            </button>
            <button
              onClick={() => setLightbox(true)}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ZoomIn size={11} /> Full Size
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="p-3">
          {imgError ? (
            <div className="h-32 flex flex-col items-center justify-center text-gray-600 gap-2 rounded-lg bg-white/[0.02] border border-white/5">
              <ImageOff size={20} />
              <span className="text-xs">Could not load image</span>
            </div>
          ) : (
            <button
              onClick={() => setLightbox(true)}
              className="relative w-full group rounded-lg overflow-hidden border border-white/10 block"
            >
              <img
                src={screenshot.data}
                alt={screenshot.name || 'screenshot'}
                onError={() => setImgError(true)}
                className="w-full max-h-48 object-contain bg-black/20"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <ZoomIn size={13} className="text-white" />
                  <span className="text-white text-xs font-medium">View Full Size</span>
                </div>
              </div>
            </button>
          )}

          {/* File info */}
          {(screenshot.name || screenshot.size) && (
            <div className="mt-2 flex items-center gap-2">
              {screenshot.name && (
                <span className="text-xs text-gray-500 truncate">{screenshot.name}</span>
              )}
              {screenshot.size && (
                <span className="text-xs text-gray-700 flex-shrink-0">· {formatBytes(screenshot.size)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 z-50 backdrop-blur-sm"
              onClick={() => setLightbox(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-5xl">
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Lightbox header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {screenshot.name || 'Screenshot'}
                      </p>
                      {screenshot.size && (
                        <p className="text-xs text-gray-500">{formatBytes(screenshot.size)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
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
                  {/* Lightbox image */}
                  <div
                    className="p-4 flex items-center justify-center bg-[#0a0a0a] overflow-auto"
                    style={{ maxHeight: 'calc(85vh - 60px)' }}
                  >
                    <img
                      src={screenshot.data}
                      alt={screenshot.name || 'screenshot'}
                      className="max-w-full max-h-full rounded-lg object-contain"
                      onError={() => setImgError(true)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
