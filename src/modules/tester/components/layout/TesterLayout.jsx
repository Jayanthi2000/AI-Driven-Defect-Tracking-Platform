// TesterLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TesterSidebar from './TesterSidebar';
import TesterNavbar from './TesterNavbar';
import TesterBackground from '../shared/TesterBackground';

export default function TesterLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const sidebarWidth = collapsed ? 72 : 220;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      <TesterBackground />

      <TesterSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >
        <TesterNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}