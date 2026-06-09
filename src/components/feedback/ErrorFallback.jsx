import { TriangleAlert } from 'lucide-react'

const ErrorFallback = ({ message = 'Something went wrong.' }) => {
  return (
    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
        <TriangleAlert className="text-red-400" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        Unexpected Error
      </h3>

      <p className="text-slate-400 max-w-md mx-auto">
        {message}
      </p>
    </div>
  )
}

export default ErrorFallback