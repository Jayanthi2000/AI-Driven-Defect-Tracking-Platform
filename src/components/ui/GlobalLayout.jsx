export function GlobalLayout({ children, maxWidth = 'max-w-screen-xl' }) {
  return (
    <div className="relative min-h-screen bg-[#050816]">
      {/* ── Shared background system ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
          }}
        />
        {/* Top-left glow */}
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
          }}
        />
        {/* Horizontal depth line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '30%',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(34,197,94,0.05) 40%, rgba(34,197,94,0.05) 60%, transparent)',
          }}
        />
      </div>

      {/* Page content */}
      <div className={`relative z-10 ${maxWidth} mx-auto px-4 sm:px-6 py-8`}>
        {children}
      </div>
    </div>
  );
}