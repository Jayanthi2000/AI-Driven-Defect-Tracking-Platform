import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080A0E] text-white">
      <h1 className="text-8xl font-black text-emerald-400">404</h1>
      <p className="mt-4 text-xl text-slate-300">Page Not Found</p>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
