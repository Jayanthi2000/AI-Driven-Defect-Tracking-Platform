// DeveloperLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperSidebar from './DeveloperSidebar';
import DeveloperNavbar from './DeveloperNavbar';
import DefectBackground from './DefectBackground';

const DeveloperLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div
  className="h-screen flex relative overflow-hidden"
  style={{ background: '#0a0a0a' }}
>
      <DefectBackground />

      <DeveloperSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
        <DeveloperNavbar onMobileMenuOpen={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="min-h-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DeveloperLayout;
