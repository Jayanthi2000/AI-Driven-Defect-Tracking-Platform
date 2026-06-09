import { SearchX } from 'lucide-react'

const SearchEmpty = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
        <SearchX className="text-slate-300" size={28} />
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">
        No Results Found
      </h3>

      <p className="text-slate-400">
        Try adjusting your search filters or keywords.
      </p>
    </div>
  )
}

export default SearchEmpty