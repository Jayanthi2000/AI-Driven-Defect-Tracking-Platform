import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const S = {
  card: { background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 },
};

const CHANNELS = [
  { id: 'general', name: '# general', unread: 2 },
  { id: 'bugs', name: '# bug-reports', unread: 5 },
  { id: 'dev', name: '# dev-team', unread: 0 },
  { id: 'releases', name: '# releases', unread: 1 },
  { id: 'random', name: '# random', unread: 0 },
];

const MEMBERS = [
  { id: 1, name: 'Arjun Mehta', avatar: 'AM', role: 'Lead Engineer', status: 'online' },
  { id: 2, name: 'Priya Sharma', avatar: 'PS', role: 'UI/UX Engineer', status: 'online' },
  { id: 3, name: 'Dev Kumar', avatar: 'DK', role: 'Backend Engineer', status: 'away' },
  { id: 4, name: 'Ananya Roy', avatar: 'AR', role: 'QA Engineer', status: 'offline' },
  { id: 5, name: 'Ravi Nair', avatar: 'RN', role: 'DevOps', status: 'online' },
];

const INIT_MESSAGES = {
  general: [
    { id: 1, user: 'Arjun Mehta', avatar: 'AM', time: '9:04 AM', text: 'Morning everyone! Starting the standup in 5 mins.' },
    { id: 2, user: 'Priya Sharma', avatar: 'PS', time: '9:05 AM', text: 'On it! Fixed the chart flicker issue last night, should be in review soon.' },
    { id: 3, user: 'Dev Kumar', avatar: 'DK', time: '9:08 AM', text: 'Great work Priya 👏 I\'m on the WebSocket memory leak today.' },
    { id: 4, user: 'Ravi Nair', avatar: 'RN', time: '9:12 AM', text: 'Staging is updated. All green on CI/CD.' },
    { id: 5, user: 'Ananya Roy', avatar: 'AR', time: '9:15 AM', text: 'Running regression tests on the auth module. Found a minor edge case.' },
  ],
  bugs: [
    { id: 1, user: 'Ananya Roy', avatar: 'AR', time: '8:30 AM', text: '🐛 New bug: BUG-007 Mobile sidebar overlaps on iOS Safari. Severity: Medium.' },
    { id: 2, user: 'Arjun Mehta', avatar: 'AM', time: '8:45 AM', text: 'Confirmed. Assigning to Priya, she\'s on mobile this sprint.' },
    { id: 3, user: 'Priya Sharma', avatar: 'PS', time: '8:48 AM', text: 'Got it. Will look into z-index and scroll lock on iOS.' },
    { id: 4, user: 'Admin', avatar: 'AD', time: '9:00 AM', text: '⚠️ BUG-001 escalated to critical. Auth tokens expiring in 15 min. Need hotfix ASAP.' },
    { id: 5, user: 'Arjun Mehta', avatar: 'AM', time: '9:02 AM', text: 'On it now. Looks like JWT_EXPIRY env var is wrong in prod.' },
  ],
  dev: [
    { id: 1, user: 'Dev Kumar', avatar: 'DK', time: '10:00 AM', text: 'PR #142 is ready for review — PostgreSQL query optimization.' },
    { id: 2, user: 'Arjun Mehta', avatar: 'AM', time: '10:15 AM', text: 'Looks good, just left a few comments. Minor stuff.' },
    { id: 3, user: 'Dev Kumar', avatar: 'DK', time: '10:20 AM', text: 'Thanks! Addressed all comments. Merging now.' },
  ],
};

const StatusDot = ({ status }) => {
  const colors = { online: '#22c55e', away: '#fbbf24', offline: '#475569' };
  return (
    <div style={{
      width: 9, height: 9, borderRadius: '50%',
      background: colors[status],
      boxShadow: status === 'online' ? '0 0 6px rgba(34,197,94,0.7)' : 'none',
      border: '1.5px solid rgba(10,15,28,0.9)',
      position: 'absolute', bottom: -1, right: -1,
    }} />
  );
};

const AvatarBubble = ({ initials, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 3,
    background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(20,184,166,0.15))',
    border: '1px solid rgba(34,197,94,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.35, fontWeight: 700, color: '#22c55e', flexShrink: 0,
  }}>{initials}</div>
);

export default function TeamChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const channelMessages = messages[activeChannel] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel, channelMessages.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), user: 'Admin', avatar: 'AD', time: timeStr, text: input.trim(), isSelf: true };
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInput('');
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Team Chat</h1>
        <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>{MEMBERS.filter(m => m.status === 'online').length} members online</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: 14, flex: 1, minHeight: 0 }}>
        {/* Channels sidebar */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Channels</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {CHANNELS.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: activeChannel === ch.id ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: activeChannel === ch.id ? '#22c55e' : '#64748b',
                fontSize: 13, fontWeight: activeChannel === ch.id ? 600 : 400,
                textAlign: 'left', transition: 'all 0.14s',
              }}>
                <span>{ch.name}</span>
                {ch.unread > 0 && (
                  <span style={{
                    background: '#22c55e', color: 'black', fontSize: 10, fontWeight: 700,
                    borderRadius: 999, padding: '1px 6px', minWidth: 18, textAlign: 'center',
                  }}>{ch.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message area */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Channel header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{CHANNELS.find(c => c.id === activeChannel)?.name}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{channelMessages.length} messages today</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['🔍','📌','👥'].map(icon => (
                <button key={icon} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 13 }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence initial={false}>
              {channelMessages.map((msg, i) => {
                const isSelf = msg.isSelf || msg.user === 'Admin';
                const showAvatar = i === 0 || channelMessages[i - 1].user !== msg.user;
                return (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    style={{ display: 'flex', gap: 10, paddingTop: showAvatar ? 10 : 2, alignItems: 'flex-start', flexDirection: isSelf ? 'row-reverse' : 'row' }}
                  >
                    {showAvatar
                      ? <AvatarBubble initials={msg.avatar} size={30} />
                      : <div style={{ width: 30, flexShrink: 0 }} />
                    }
                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
                      {showAvatar && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4, flexDirection: isSelf ? 'row-reverse' : 'row' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: isSelf ? '#22c55e' : '#94a3b8' }}>{msg.user}</span>
                          <span style={{ fontSize: 10, color: '#334155' }}>{msg.time}</span>
                        </div>
                      )}
                      <div style={{
                        padding: '8px 14px', borderRadius: isSelf ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                        background: isSelf ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                        border: isSelf ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.06)',
                        fontSize: 13, color: '#e2e8f0', lineHeight: 1.5,
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${CHANNELS.find(c => c.id === activeChannel)?.name}…`}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none',
              }}
            />
            <button onClick={sendMessage} style={{
              width: 38, height: 38, borderRadius: 10, background: input ? '#22c55e' : 'rgba(255,255,255,0.05)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input ? 'black' : '#475569', transition: 'all 0.15s',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Members sidebar */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Members</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['online','away','offline'].map(status => {
              const members = MEMBERS.filter(m => m.status === status);
              if (!members.length) return null;
              return (
                <div key={status}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, marginTop: 4 }}>
                    {status} — {members.length}
                  </div>
                  {members.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 6px', borderRadius: 9, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <AvatarBubble initials={m.avatar} size={28} />
                        <StatusDot status={m.status} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: status === 'offline' ? '#475569' : '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name.split(' ')[0]}</div>
                        <div style={{ fontSize: 10, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
