// StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    onClick={onClick}
    className={onClick ? 'cursor-pointer' : ''}
  >
    <div
      className="rounded-2xl p-5 relative overflow-hidden hover:border-white/15 transition-all duration-300 group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
        style={{ background: color, filter: 'blur(20px)', transform: 'translate(30%, -30%)' }}
      />
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <TrendingUp className="w-4 h-4 text-white/20 group-hover:text-emerald-400/50 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/50 text-sm">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;
