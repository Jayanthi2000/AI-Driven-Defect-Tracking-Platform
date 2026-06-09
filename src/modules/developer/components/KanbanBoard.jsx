// KanbanBoard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bug, Calendar, Tag } from 'lucide-react';
import { BUG_STATUS } from '../services/developerService';
import { timeAgo, getPriorityColor, getStatusColor } from '../utils/bugHelpers';

const COLUMNS = [
  { status: BUG_STATUS.ASSIGNED,          label: 'Assigned',          color: '#6366f1' },
  { status: BUG_STATUS.IN_PROGRESS,       label: 'In Progress',       color: '#f59e0b' },
  { status: BUG_STATUS.FIXED,             label: 'Fixed',             color: '#10b981' },
  { status: BUG_STATUS.READY_FOR_TESTING, label: 'Ready For Testing', color: '#3b82f6' },
];

const Badge = ({ value, color }) => (
  <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: `${color}20`, color }}>
    {value?.replace(/_/g, ' ')}
  </span>
);

const BugKanbanCard = ({ bug }) => {
  const navigate    = useNavigate();
  const priorityClr = getPriorityColor(bug.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/developer/bug-details/${bug.id}`)}
      className="p-3 rounded-xl cursor-pointer hover:border-white/15 transition-all duration-200 group mb-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="text-white/75 text-xs font-medium group-hover:text-white transition-colors line-clamp-2 mb-2">
        {bug.title}
      </p>
      <div className="flex items-center justify-between gap-2">
        <Badge value={bug.priority} color={priorityClr} />
        <span className="text-white/30 text-xs flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {timeAgo(bug.createdAt)}
        </span>
      </div>
      {bug.module && (
        <div className="mt-1.5 flex items-center gap-1 text-white/25 text-xs">
          <Tag className="w-3 h-3" />
          {bug.module}
        </div>
      )}
    </motion.div>
  );
};

const KanbanBoard = ({ bugs = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map(col => {
        const colBugs = bugs.filter(b => b.status === col.status);
        return (
          <div key={col.status} className="flex flex-col">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-t-xl mb-0"
              style={{ background: `${col.color}10`, borderBottom: `2px solid ${col.color}40`, border: `1px solid ${col.color}20` }}
            >
              <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${col.color}25`, color: col.color }}
              >
                {colBugs.length}
              </span>
            </div>
            {/* Cards */}
            <div
              className="flex-1 p-2 rounded-b-xl min-h-[120px]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}
            >
              {colBugs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-white/20">
                  <Bug className="w-5 h-5 mb-1" />
                  <span className="text-xs">No bugs</span>
                </div>
              ) : (
                colBugs.map(bug => <BugKanbanCard key={bug.id} bug={bug} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
