import { Bug } from 'lucide-react'

const NoBugsEmpty = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
        <Bug className="text-emerald-400" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        No Bugs Found
      </h3>

      <p className="text-slate-400 max-w-md mx-auto">
        There are currently no defects available in this workspace.
      </p>
    </div>
  )
}

export default NoBugsEmpty