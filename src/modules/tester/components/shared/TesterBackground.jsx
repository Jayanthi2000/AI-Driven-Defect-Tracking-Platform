// TesterBackground.jsx - Animated background matching DefectAI landing page
import { motion } from 'framer-motion';

export default function TesterBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Primary Green Glow Orb - top left */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary Glow - bottom right */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Center ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Gradient overlay top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </div>
  );
}
