const avatarColors = {
  AM: ['#3b82f6', '#1d4ed8'],
  PS: ['#8b5cf6', '#6d28d9'],
  DK: ['#10b981', '#047857'],
  AR: ['#f59e0b', '#d97706'],
  RN: ['#06b6d4', '#0e7490'],
  RS: ['#ef4444', '#dc2626'],
};

export function Avatar({ initials, size = 32, status }) {
  const colors = avatarColors[initials] || ['#4a5a6e', '#374151'];
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 600, color: 'white', letterSpacing: '0.02em',
        flexShrink: 0,
      }}>
        {initials}
      </div>
      {status && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: size * 0.28, height: size * 0.28, borderRadius: '50%',
          background: status === 'online' ? 'var(--green)' : status === 'away' ? 'var(--amber)' : 'var(--text-muted)',
          border: '2px solid var(--bg-base)',
        }} />
      )}
    </div>
  );
}