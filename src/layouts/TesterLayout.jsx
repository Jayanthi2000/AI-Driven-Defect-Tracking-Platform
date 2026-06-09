// Re-export from the tester module so any old import still works
export { default } from '../modules/tester/components/layout/TesterLayout';
// TesterLayout.jsx — matches AdminLayout exactly
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TesterNavbar from './TesterNavbar';
import TesterSidebar from './TesterSidebar';

const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    <div className="absolute inset-0 bg-[#050816]" />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
    <div
      className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-10"
      style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
    />
    <div
      className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-8"
      style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
    />
    <div
      className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full opacity-5"
      style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
    />
  </div>
);

export default function TesterLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen text-white font-sans">
      <GridBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TesterNavbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <TesterSidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <main
            style={{
              flex: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              padding: '28px 28px',
              minWidth: 0,
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
