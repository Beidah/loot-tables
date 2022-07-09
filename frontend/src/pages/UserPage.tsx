import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Pagination from "../components/Pagination";
import TableCard from "../components/TableCard";
import { selectUser, selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getUser, User } from "../services/userServices";

const PageSize = 10;

function UserPage() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{id: string}>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);
  const currentUser = useAppSelector(selectUser);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const user = await getUser(id, true, userToken);
          setUser(user);
        } catch (error) {
          dispatch(setError((error as Error).message));
        }

        setLoading(false);
      } else {
        navigate('/');
      }
    }

    fetchUser();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return user?.tables?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, user]);

  if (loading) {
    // TODO: create loading component
    return (
      <div className="container text-center">Loading</div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <h1 className="text-center">User not found</h1>
      </div>
    )
  }

  const onDelete = (tableId: string) => console.log("Delete", tableId)

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-2xl p-5">
      <h2 className="text-2xl text-center mb-5 font-bold">{user.name}'s Tables</h2>
      <div className="container">
          {currentTableData?.map((table) => (
            <TableCard 
              key={table._id} 
              table={table} 
              displayAuthor={false} 
              onDelete={
                currentUser && currentUser._id === id ?
                  () => onDelete(table._id) :
                  undefined
              }
            />
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={user.tables?.length || 0}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  )
}

export default UserPage;