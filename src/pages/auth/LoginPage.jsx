import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDashboardRoute } from "../../services/authService";
import { validateEmail } from "../../utils/validation";
import AuthBackground, { AuthCard, AuthLogo } from "../../components/auth/AuthBackground";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || null;

  const [form, setForm]         = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)                     e.email    = "Email is required.";
    else if (!validateEmail(form.email)) e.email    = "Enter a valid email address.";
    if (!form.password)                  e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);

    // Slight delay for UX
    await new Promise((r) => setTimeout(r, 800));
    const result = login(form);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 600));
    // Use stored 'from' location if set by ProtectedRoute, otherwise go to role dashboard
    navigate(from || getDashboardRoute(result.user.role), { replace: true });
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md z-10">
        <AuthCard>
          <AuthLogo />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-[#6b7280] text-sm mt-1">Sign in to your DefectAI workspace</p>
          </div>

          {/* Success banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20"
              >
                <CheckCircle2 size={15} className="text-[#22c55e] flex-shrink-0" />
                <span className="text-[#22c55e] text-sm">Login successful! Redirecting…</span>
              </motion.div>
            )}

            {/* Error banner */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{apiError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AuthInput
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={() => {
                if (form.email && !validateEmail(form.email))
                  setErrors((p) => ({ ...p, email: "Enter a valid email address." }));
              }}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange("password")}
              icon={Lock}
              error={errors.password}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setForm((p) => ({ ...p, rememberMe: !p.rememberMe }))}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 ${
                    form.rememberMe
                      ? "bg-[#22c55e] border-[#22c55e]"
                      : "border-white/[0.15] bg-white/[0.04] group-hover:border-white/[0.25]"
                  }`}
                >
                  {form.rememberMe && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#9ca3af] group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#22c55e] hover:text-[#4ade80] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-1">
              <AuthButton type="submit" loading={loading} disabled={success}>
                {loading ? "Signing in…" : "Sign in"}
              </AuthButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-[#4b5563] bg-transparent">
                New to DefectAI?
              </span>
            </div>
          </div>

          <Link to="/register">
            <AuthButton variant="ghost">Create an account</AuthButton>
          </Link>

          <p className="mt-4 text-center text-xs text-[#374151]">
            By signing in you agree to our{" "}
            <span className="text-[#22c55e]/60 hover:text-[#22c55e] cursor-pointer transition-colors">
              Terms of Service
            </span>
          </p>
        </AuthCard>
      </div>
    </div>
  );
};

export default LoginPage;