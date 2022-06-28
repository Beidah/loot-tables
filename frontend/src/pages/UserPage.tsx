import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getUser, User } from "../services/userServices";

function UserPage() {
  const [user, setUser] = useState<User>();
  const { id } = useParams<{id: string}>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const user = await getUser(id, true, userToken);
          console.log(user.tables);
          setUser(user);
        } catch (error) {
          dispatch(setError((error as Error).message));
        }
      } else {
        navigate('/');
      }
    }

    fetchUser();
  }, [id, navigate, dispatch, userToken]);

  if (!user) {
    return (
      <div className="container">User not found</div>
    )
  }

  return (
    <div className="container">
      <h2 className="text-center">{user.name}</h2>
    </div>
  )
}

export default UserPage;