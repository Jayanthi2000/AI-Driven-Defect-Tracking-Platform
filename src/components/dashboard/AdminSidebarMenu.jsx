import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import adminMenu from "../../pages/admin/adminMenu";

function AdminSidebarMenu() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {adminMenu.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink key={item.id} to={item.path} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.12 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: isActive ? "1px solid rgba(34,197,94,0.18)" : "1px solid transparent",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,184,166,0.05) 100%)"
                    : "transparent",
                  color: isActive ? "#22c55e" : "#64748b",
                  transition: "all 0.16s",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 0 12px rgba(34,197,94,0.06)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && (
                  <span style={{
                    position: "absolute",
                    left: 0, top: "20%", bottom: "20%",
                    width: 2,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #22c55e, #14b8a6)",
                    boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                  }} />
                )}

                <div style={{
                  padding: "6px",
                  borderRadius: 8,
                  background: isActive ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#22c55e" : "#475569",
                  flexShrink: 0,
                  transition: "all 0.16s",
                }}>
                  <Icon size={15} />
                </div>

                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, letterSpacing: "-0.01em" }}>
                  {item.label}
                </span>

                {isActive && (
                  <span style={{
                    marginLeft: "auto",
                    width: 5, height: 5,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px rgba(34,197,94,0.9)",
                    flexShrink: 0,
                  }} />
                )}
              </motion.div>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}

export default AdminSidebarMenu;
