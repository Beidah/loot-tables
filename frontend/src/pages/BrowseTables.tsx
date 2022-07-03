import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getAllTables, Table } from "../services/tableServices";

function BrowseTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await getAllTables(userToken);
        setTables(tables);
      } catch (error) {
        dispatch(setError((error as Error).message));
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-lg p-5 min-h-full">
      <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">Tables</h1>
      <div className="mt-6">
        {loading && <p>Loading...</p>}
        {!loading && 
          tables.map((table) => (
            <div key={table._id}>
              <p><Link to={`/tables/${table._id}`}>{table.name}</Link></p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default BrowseTables