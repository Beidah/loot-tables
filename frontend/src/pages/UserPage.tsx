import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getUser, User } from "../services/userServices";

function UserPage() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{id: string}>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);

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
  }, [id, navigate, dispatch, userToken]);

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

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-2xl p-5">
      <h2 className="text-2xl text-center mb-5 font-bold">{user.name}'s Tables</h2>
      <div className="container">
        <ul>
          {user.tables?.map((table) => (
            <li key={table._id}>
              <Link className="text-blue-500" to={`/tables/${table._id}`}>{table.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserPage;