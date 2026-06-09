import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const widths = { sm: 400, md: 560, lg: 720, xl: 900 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
              borderRadius: 14, width: '100%', maxWidth: widths[size],
              maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
              <button onClick={onClose} className="btn-ghost" style={{ padding: '4px 6px', borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
            {footer && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}