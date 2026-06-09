/* =======================================
   FOOTER — LANDING PAGE
======================================= */

import React from "react";
import { Link } from "react-router-dom";
import { Bug, Github, Twitter, Linkedin } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Docs", to: "/docs" },
    { label: "Changelog", to: "/" },
  ],
  Company: [
    { label: "About", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Contact", to: "/" },
  ],
  Legal: [
    { label: "Privacy", to: "/" },
    { label: "Terms", to: "/" },
    { label: "Security", to: "/" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,8,14,0.95)",
        padding: "60px 24px 32px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          <style>{`
            @media(max-width:768px){
              .footer-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media(max-width:480px){
              .footer-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Brand column */}
          <div>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                textDecoration: "none",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bug size={14} style={{ color: "#fff" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Defect<span style={{ color: "#10b981" }}>AI</span>
              </span>
            </Link>

            <p
              style={{
                fontSize: 13,
                color: "rgba(148,163,184,0.6)",
                lineHeight: 1.7,
                maxWidth: 260,
                margin: "0 0 20px",
              }}
            >
              AI-powered bug tracking and defect management for modern engineering teams.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(148,163,184,0.6)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                    e.currentTarget.style.color = "#34d399";
                    e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "rgba(148,163,184,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(148,163,184,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 16px",
                }}
              >
                {heading}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{
                      fontSize: 13,
                      color: "rgba(148,163,184,0.6)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(148,163,184,0.6)")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "rgba(148,163,184,0.4)" }}>
            © 2025 DefectAI, Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16,185,129,0.8)",
              }}
            />
            <span style={{ fontSize: 12, color: "rgba(148,163,184,0.4)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}