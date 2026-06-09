// ActivityCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bug, MessageSquare, CheckCircle, Play, Send, FileText } from 'lucide-react';
import { timeAgo } from '../utils/bugHelpers';

const ACTION_CONFIG = {
  'Started Bug':         { icon: Play,          color: '#10b981' },
  'Fixed Bug':           { icon: CheckCircle,   color: '#22c55e' },
  'Added Comment':       { icon: MessageSquare, color: '#6366f1' },
  'Updated Fix Notes':   { icon: FileText,      color: '#f59e0b' },
  'Sent For Testing':    { icon: Send,          color: '#3b82f6' },
  'Paused Bug':          { icon: Bug,           color: '#f97316' },
  'default':             { icon: Activity,      color: '#10b981' },
};

const ActivityCard = ({ activity, delay = 0 }) => {
  const config = ACTION_CONFIG[activity.action] || ACTION_CONFIG['default'];
  const Icon   = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${config.color}15`, border: `1px solid ${config.color}25` }}
      >
        <Icon className="w-4 h-4" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-sm font-medium">{activity.action}</p>
        {activity.details && (
          <p className="text-white/40 text-xs mt-0.5 truncate">{activity.details}</p>
        )}
        <p className="text-white/25 text-xs mt-0.5">{timeAgo(activity.timestamp)}</p>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
