import { BarChart3 } from 'lucide-react'

const NoAnalyticsEmpty = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
        <BarChart3 className="text-amber-400" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        Analytics Unavailable
      </h3>

      <p className="text-slate-400">
        There is not enough data available to generate analytics.
      </p>
    </div>
  )
}

export default NoAnalyticsEmpty