import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function MobileSidebar({
  isOpen,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0 z-40
              bg-black/60 backdrop-blur-sm
              lg:hidden
            "
          />

          {/* SIDEBAR */}

          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 260,
            }}
            className="
              fixed left-0 top-0 z-50
              h-screen
              lg:hidden
            "
          >
            <Sidebar
              mobile
              closeSidebar={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}