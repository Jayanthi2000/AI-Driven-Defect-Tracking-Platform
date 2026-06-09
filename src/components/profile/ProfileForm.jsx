import { useState } from "react";
import { motion } from "framer-motion";
import { userProfile } from "../../data/profileData";

const ProfileForm = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
    location: userProfile.location,
    timezone: userProfile.timezone,
    bio: userProfile.bio,
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5"
    >
      <p className="text-sm font-semibold text-white mb-5">Edit Information</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {[
          { label: "Full Name", name: "name" },
          { label: "Email", name: "email" },
          { label: "Job Title", name: "role" },
          { label: "Location", name: "location" },
          { label: "Timezone", name: "timezone" },
        ].map((field) => (
          <div key={field.name}>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
              {field.label}
            </label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-emerald-400"
          >
            ✓ Profile updated
          </motion.span>
        )}
        <button
          onClick={handleSave}
          className="text-xs font-semibold px-5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
        >
          Save Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileForm;
