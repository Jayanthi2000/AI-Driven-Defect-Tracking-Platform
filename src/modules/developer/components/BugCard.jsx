// BugCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { timeAgo } from '../utils/bugHelpers';
import { getPriorityColor, getStatusColor } from '../utils/bugHelpers';

const Badge = ({ value, color }) => (
  <span
    className="px-2 py-0.5 rounded-lg text-xs font-medium"
    style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
  >
    {value?.replace(/_/g, ' ')}
  </span>
);

const BugCard = ({ bug, onClick, delay = 0 }) => {
  const priorityColor = getPriorityColor(bug.priority);
  const statusColor   = getStatusColor(bug.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={() => onClick?.(bug)}
      className="rounded-2xl p-4 cursor-pointer hover:border-white/15 transition-all duration-200 group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white/80 text-sm font-medium group-hover:text-white transition-colors line-clamp-2 flex-1">
          {bug.title}
        </h3>
        <Badge value={bug.status} color={statusColor} />
      </div>

      {bug.description && (
        <p className="text-white/40 text-xs mb-3 line-clamp-2">{bug.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge value={bug.priority} color={priorityColor} />
          {bug.module && (
            <span className="flex items-center gap-1 text-white/30 text-xs">
              <Tag className="w-3 h-3" />
              {bug.module}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-white/30 text-xs">
          <Calendar className="w-3 h-3" />
          {timeAgo(bug.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};

export default BugCard;
