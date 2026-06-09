// DefectBackground.jsx - Shared animated background matching Landing Page
import React from 'react';
import { motion } from 'framer-motion';

const DefectBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Base dark background */}
    <div className="absolute inset-0 bg-[#0a0a0a]" />

    {/* Animated grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />

    {/* Primary green glow orb - top left */}
    <motion.div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 50%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Secondary green glow orb - bottom right */}
    <motion.div
      className="absolute -bottom-60 -right-60 w-[700px] h-[700px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 50%, transparent 70%)',
        filter: 'blur(60px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.9, 0.5],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />

    {/* Mid accent orb */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
    />

    {/* Gradient overlay for depth */}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.5) 100%)',
      }}
    />
  </div>
);

export default DefectBackground;