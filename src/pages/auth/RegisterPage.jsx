import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, ShieldOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, isPasswordValid } from "../../utils/validation";
import { isAdminLimitReached, MAX_ADMINS } from "../../services/authService";
import AuthBackground, { AuthCard, AuthLogo } from "../../components/auth/AuthBackground";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";

const RegisterPage = () => {
  const navigate      = useNavigate();
  const { register }  = useAuth();

  const [adminLimitReached, setAdminLimitReached] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState(false);

  // Check admin limit on mount
  useEffect(() => {
    setAdminLimitReached(isAdminLimitReached());
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!form.email)                     e.email    = "Email is required.";
    else if (!validateEmail(form.email)) e.email    = "Enter a valid email address.";
    if (!form.password)                  e.password = "Password is required.";
    else if (!isPasswordValid(form.password))
      e.password = "Password does not meet all requirements.";
    if (!form.confirm)                   e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    const result = await register({ name: form.name.trim(), email: form.email, password: form.password });
    setLoading(false);

    if (!result.success) { setApiError(result.error); return; }

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1000));
    navigate("/login", { replace: true });
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setApiError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md z-10">
        <AuthCard>
          <AuthLogo />

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 mb-3">
              <ShieldCheck size={12} className="text-[#22c55e]" />
              <span className="text-[#22c55e] text-xs font-medium tracking-wide">ADMIN REGISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Admin Account</h1>
            <p className="text-[#6b7280] text-sm mt-1">Register as a workspace administrator</p>
          </div>

          {/* Admin limit reached — block registration */}
          {adminLimitReached && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col items-center gap-3 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center"
            >
              <ShieldOff size={28} className="text-amber-400" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">Registration Closed</p>
                <p className="text-amber-400/80 text-xs mt-1">
                  The maximum of {MAX_ADMINS} admin accounts has been reached.
                  Contact your workspace administrator to get access.
                </p>
              </div>
              <Link to="/login">
                <AuthButton variant="ghost">Sign in instead</AuthButton>
              </Link>
            </motion.div>
          )}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20"
              >
                <CheckCircle2 size={15} className="text-[#22c55e] flex-shrink-0" />
                <span className="text-[#22c55e] text-sm">Account created! Redirecting to login…</span>
              </motion.div>
            )}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{apiError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!adminLimitReached && (
            <>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AuthInput
              label="Full name" type="text" placeholder="John Smith"
              value={form.name} onChange={handleChange("name")}
              icon={User} error={errors.name} autoComplete="name"
            />
            <AuthInput
              label="Email address" type="email" placeholder="admin@company.com"
              value={form.email} onChange={handleChange("email")}
              icon={Mail} error={errors.email} autoComplete="email"
            />
            <div>
              <AuthInput
                label="Password" type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password} onChange={handleChange("password")}
                icon={Lock} error={errors.password} autoComplete="new-password"
                rightElement={
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              <PasswordStrengthMeter password={form.password} />
            </div>
            <AuthInput
              label="Confirm password" type={showConf ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirm} onChange={handleChange("confirm")}
              icon={Lock} error={errors.confirm} autoComplete="new-password"
              rightElement={
                <button type="button" onClick={() => setShowConf((v) => !v)}
                  className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                  {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <div className="pt-1">
              <AuthButton type="submit" loading={loading} disabled={success}>
                {loading ? "Creating account…" : "Create Admin Account"}
              </AuthButton>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-[#4b5563]">Already have an account?</span>
            </div>
          </div>

          <Link to="/login">
            <AuthButton variant="ghost">Sign in</AuthButton>
          </Link>
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default RegisterPage;