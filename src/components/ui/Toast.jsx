import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({
    title = "",
    description = "",
    type = "info",
  }) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        description,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              className="glass-card"
              style={{
                width: 320,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div>
                {t.type === "success" && (
                  <CheckCircle2
                    color="#10b981"
                    size={20}
                  />
                )}

                {t.type === "error" && (
                  <AlertCircle
                    color="#ef4444"
                    size={20}
                  />
                )}

                {t.type === "info" && (
                  <Info
                    color="#3b82f6"
                    size={20}
                  />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    color: "var(--text-primary)",
                  }}
                >
                  {t.title}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  {t.description}
                </div>
              </div>

              <button
                onClick={() =>
                  setToasts((prev) =>
                    prev.filter(
                      (x) => x.id !== t.id
                    )
                  )
                }
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}