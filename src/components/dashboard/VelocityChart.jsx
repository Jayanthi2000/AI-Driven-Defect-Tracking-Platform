import { Database } from 'lucide-react'

const EmptyState = ({
  title = 'No data found',
  description = 'There is currently nothing to display.',
  action
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
        <Database className="text-slate-400" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState