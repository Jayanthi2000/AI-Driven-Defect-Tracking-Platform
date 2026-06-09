import { motion } from "framer-motion";

function AdminWelcomeGlow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none"
    >
      {/* Primary green glow — top right, matches auth/landing */}
      <div
        className="absolute"
        style={{
          top: "-80px",
          right: "-60px",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse at top right, rgba(20,184,166,0.16) 0%, rgba(34,197,94,0.08) 40%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      {/* Secondary ambient — left center */}
      <div
        className="absolute"
        style={{
          top: "100px",
          left: "-80px",
          width: "350px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(34,197,94,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
    </motion.div>
  );
}

export default AdminWelcomeGlow;
