import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Pagination from "../components/Pagination";
import TableCard from "../components/TableCard";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getAllTables, Table } from "../services/tableServices";

const PageSize = 10;

function BrowseTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return tables.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, tables]);

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
      <div className="mt-6 mb-2">
        {loading && <p>Loading...</p>}
        {!loading && 
          currentTableData.map((table) => (
            <TableCard key={table._id} table={table} displayAuthor={true} />
          ))
        }
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={tables.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  )
}

export default BrowseTables;