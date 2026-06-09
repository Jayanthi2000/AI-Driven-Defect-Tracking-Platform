import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  NotificationProvider,
} from "./context/NotificationContext";

import {
  TicketProvider,
} from "./context/TicketContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>

      <NotificationProvider>

        <TicketProvider>

          <BrowserRouter>

            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={12}
              toastOptions={{
                duration: 3000,

                style: {
                  background: "#111827",
                  color: "#fff",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "14px 16px",
                  fontSize: "14px",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 10px 40px rgba(0,0,0,0.35)",
                },

                success: {
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },

                error: {
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />

          </BrowserRouter>

        </TicketProvider>

      </NotificationProvider>

    </AuthProvider>

  </React.StrictMode>
);