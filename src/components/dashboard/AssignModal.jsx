import { useEffect, useState } from "react";

const developers = [
  "Rahul",
  "Kavin",
  "Sneha",
  "Vikram",
];

export default function AssignModal({
  bug,
  onClose,
}) {
  const [selected, setSelected] =
    useState(developers[0]);

  /* =========================================================
     FIX CRASH
  ========================================================= */

  if (!bug) return null;

  /* =========================================================
     ESC CLOSE
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  /* =========================================================
     ASSIGN HANDLER
  ========================================================= */

  const handleAssign = () => {
    console.log(
      `Assigned "${bug.title}" to ${selected}`
    );

    onClose?.();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70
        px-4
        backdrop-blur-sm
      "
    >
      {/* BACKDROP CLICK */}

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* MODAL */}

      <div
        className="
          relative z-10
          w-full max-w-md
          rounded-3xl
          border border-slate-800
          bg-slate-950
          p-6
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Assign Issue
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {bug?.title || "Untitled Bug"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              border border-slate-800
              p-2
              text-slate-400
              transition-all
              hover:border-slate-700
              hover:text-white
            "
          >
            ✕
          </button>
        </div>

        {/* SELECT */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Select Developer
          </label>

          <select
            value={selected}
            onChange={(e) =>
              setSelected(
                e.target.value
              )
            }
            className="
              w-full rounded-xl
              border border-slate-700
              bg-slate-900
              p-3
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
            "
          >
            {developers.map(
              (dev) => (
                <option
                  key={dev}
                  value={dev}
                >
                  {dev}
                </option>
              )
            )}
          </select>
        </div>

        {/* BUG INFO */}

        <div
          className="
            mt-5 rounded-2xl
            border border-slate-800
            bg-slate-900/60
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Severity
            </span>

            <span
              className="
                rounded-full
                bg-red-500/10
                px-3 py-1
                text-xs font-medium
                text-red-400
              "
            >
              {bug?.severity || "High"}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Description
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {bug?.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-xl
              border border-slate-700
              px-4 py-2
              text-slate-300
              transition-all
              hover:border-slate-600
              hover:bg-slate-900
            "
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            className="
              rounded-xl
              bg-cyan-500
              px-5 py-2
              font-semibold
              text-slate-950
              transition-all
              hover:bg-cyan-400
            "
          >
            Assign to {selected}
          </button>
        </div>
      </div>
    </div>
  );
}