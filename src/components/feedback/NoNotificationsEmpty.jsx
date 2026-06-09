import { BellOff } from 'lucide-react'

const NoNotificationsEmpty = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5">
        <BellOff className="text-violet-400" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        No Notifications
      </h3>

      <p className="text-slate-400">
        You're all caught up. No new notifications available.
      </p>
    </div>
  )
}

export default NoNotificationsEmpty