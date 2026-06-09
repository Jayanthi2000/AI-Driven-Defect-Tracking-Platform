import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { validateEmail } from "../../utils/validation";
import AuthBackground, { AuthCard, AuthLogo } from "../../components/auth/AuthBackground";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const ForgotPasswordPage = () => {
  const navigate             = useNavigate();
  const { forgotPassword }   = useAuth();

  const [email, setEmail]    = useState("");
  const [error, setError]    = useState("");
  const [loading, setLoading]= useState(false);
  const [sent, setSent]      = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!email)                     return setError("Email is required.");
    if (!validateEmail(email))      return setError("Enter a valid email address.");
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    const result = await forgotPassword(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setResetToken(result.token);
    setSent(true);
  };

  const handleContinue = () => {
    navigate(`/reset-password?token=${resetToken}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md z-10">
        <AuthCard>
          <AuthLogo />

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Forgot password?</h1>
                  <p className="text-[#6b7280] text-sm mt-1 leading-relaxed">
                    Enter the email address tied to your account and we'll generate a password reset link.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <AuthInput
                    label="Email address"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    icon={Mail}
                    error={error && !email ? error : ""}
                    autoComplete="email"
                  />

                  <div className="pt-1">
                    <AuthButton type="submit" loading={loading}>
                      {loading ? "Verifying email…" : "Send reset link"}
                    </AuthButton>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} className="text-[#22c55e]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">Reset link ready</h2>
                  <p className="text-[#6b7280] text-sm mt-2 leading-relaxed">
                    In a production system, a reset link would be sent to{" "}
                    <span className="text-[#9ca3af]">{email}</span>. Since this is a
                    local simulation, click below to proceed.
                  </p>
                </div>

                {/* Simulated token display */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left">
                  <p className="text-xs text-[#4b5563] mb-1 font-mono">Reset token (simulated)</p>
                  <p className="text-xs text-[#22c55e] font-mono break-all">{resetToken}</p>
                </div>

                <AuthButton onClick={handleContinue}>
                  Continue to Reset Password →
                </AuthButton>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;