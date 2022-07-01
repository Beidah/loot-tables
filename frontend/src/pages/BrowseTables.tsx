import { useState } from "react"

function BrowseTables() {
  const [tables, setTables] = useState([]);
  
  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-lg p-5 min-h-full">
      <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">Tables</h1>
      <div>

      </div>
    </div>
  )
}
export default BrowseTables