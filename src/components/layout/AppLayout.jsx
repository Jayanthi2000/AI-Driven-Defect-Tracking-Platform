import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '../ui/CommandPalette';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your workspace' },
  '/analytics': { title: 'Analytics', subtitle: 'Performance metrics & trends' },
  '/bugs': { title: 'Bug Reports', subtitle: 'Track and manage issues' },
  '/kanban': { title: 'Kanban Board', subtitle: 'Sprint task management' },
  '/ai-insights': { title: 'AI Insights', subtitle: 'Intelligent recommendations' },
  '/team': { title: 'Team', subtitle: 'Manage your developers' },
  '/assignments': { title: 'Assignments', subtitle: 'Task assignments overview' },
  '/notifications': { title: 'Notifications', subtitle: 'Your alerts and updates' },
  '/activity': { title: 'Activity Logs', subtitle: 'System & user activity' },
  '/reports': { title: 'Reports', subtitle: 'Generated reports & exports' },
  '/integrations': { title: 'Integrations', subtitle: 'Connected services' },
  '/settings': { title: 'Settings', subtitle: 'Workspace configuration' },
  '/profile': { title: 'Profile', subtitle: 'Your account & preferences' },
};

export function AppLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: 'Nexus', subtitle: '' };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar onCommandPalette={() => setCmdOpen(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header onCommandPalette={() => setCmdOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}