import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isPasswordValid } from "../../utils/validation";
import { validateResetToken } from "../../services/authService";
import AuthBackground, { AuthCard, AuthLogo } from "../../components/auth/AuthBackground";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";

const ResetPasswordPage = () => {
  const navigate               = useNavigate();
  const [searchParams]         = useSearchParams();
  const { resetPassword }      = useAuth();

  const token = searchParams.get("token") || "";

  const [tokenStatus, setTokenStatus] = useState("validating"); // validating | valid | invalid
  const [tokenError, setTokenError]   = useState("");

  const [form, setForm]               = useState({ password: "", confirm: "" });
  const [errors, setErrors]           = useState({});
  const [showPass, setShowPass]       = useState(false);
  const [showConf, setShowConf]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState("");
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      setTokenError("No reset token found. Please request a new password reset.");
      return;
    }
    const result = validateResetToken(token);
    if (result.valid) {
      setTokenStatus("valid");
    } else {
      setTokenStatus("invalid");
      setTokenError(result.error);
    }
  }, [token]);

  const validate = () => {
    const e = {};
    if (!form.password)                      e.password = "Password is required.";
    else if (!isPasswordValid(form.password)) e.password = "Password does not meet all requirements.";
    if (!form.confirm)                        e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password)  e.confirm  = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    const result = await resetPassword(token, form.password);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1500));
    navigate("/login", { replace: true });
  };

  // ── Invalid token state ──────────────────────────────────────
  if (tokenStatus === "validating") {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <AuthBackground />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#22c55e] text-sm font-mono tracking-widest">VALIDATING…</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <AuthBackground />
        <div className="w-full max-w-md z-10">
          <AuthCard>
            <AuthLogo />
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invalid Link</h2>
                <p className="text-[#6b7280] text-sm mt-2 leading-relaxed">{tokenError}</p>
              </div>
              <Link to="/forgot-password">
                <AuthButton>Request New Reset Link</AuthButton>
              </Link>
              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </div>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md z-10">
        <AuthCard>
          <AuthLogo />

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Reset password</h1>
                  <p className="text-[#6b7280] text-sm mt-1">Create a new secure password for your account.</p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <AuthInput
                      label="New password"
                      type={showPass ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: "" })); }}
                      icon={Lock}
                      error={errors.password}
                      autoComplete="new-password"
                      rightElement={
                        <button type="button" onClick={() => setShowPass((v) => !v)} className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                    <PasswordStrengthMeter password={form.password} />
                  </div>

                  <AuthInput
                    label="Confirm new password"
                    type={showConf ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={form.confirm}
                    onChange={(e) => { setForm((p) => ({ ...p, confirm: e.target.value })); setErrors((p) => ({ ...p, confirm: "" })); }}
                    icon={Lock}
                    error={errors.confirm}
                    autoComplete="new-password"
                    rightElement={
                      <button type="button" onClick={() => setShowConf((v) => !v)} className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                        {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  <div className="pt-1">
                    <AuthButton type="submit" loading={loading}>
                      {loading ? "Updating password…" : "Reset Password"}
                    </AuthButton>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-white transition-colors">
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} className="text-[#22c55e]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Password updated!</h2>
                  <p className="text-[#6b7280] text-sm mt-2 leading-relaxed">
                    Your password has been successfully reset. Redirecting to login…
                  </p>
                </div>
                <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;