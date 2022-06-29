import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getTable, Table as LootTable } from "../services/tableServices";

function Table() {
  const [table, setTable] = useState<LootTable>();
  const [event, setEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    const fetchTable = async () => {
      if (id) {
        try {
          const table = await getTable(id, userToken);
          setTable(table);
        } catch (error) {
          dispatch(setError((error as Error).message))
        }

        setLoading(false);
      } else {
        navigate('/');
      }
    }
    
    if (loading)
      fetchTable();
  }, [id, navigate, dispatch, userToken, loading]);

  if (loading) {
    // TODO: create loading component
    return (
      <div className="container text-center">Loading</div>
    )
  }

  if (!table) {
    // TODO: Create 404 page
    return (
      <div className="container">
        <h1>Table not found.</h1>
      </div>
    )
  }

  const roll = () => {
    if (table && table.events) {
      let items = table.events;
      let i: number;

      // The cumalitve weights by item
      let weights: number[] = [];

      for (i = 0; i < items.length; i ++) {
        weights[i] = items[i].weight + (weights[i - 1] || 0);
      }

      const random = Math.random() * weights[weights.length - 1];

      for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) break;
      }

      setEvent(items[i].name);
    }
  }

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-2xl p-5">
      <h2 className="text-2xl text-center font-bold">{table.name}</h2>
      <p className="mb-5 text-center text-slate-500 text-sm">
        Made by:&nbsp;
        <Link className="text-blue-400" to={`/users/${table.user._id}`}>{table.user.name}</Link>
      </p>
      <div className="container">
        {
          event &&
          <div className="container mx-auto rounded-md max-w-md shadow-lg p-3 my-3 bg-slate-50">
            <p>Rolled: {event}</p>
          </div>
        }
        <button onClick={roll} className="float-right py-1 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 mb-2">Roll</button>
        <table className="table table-auto border border-collapse w-full">
          <thead>
            <tr>
              <th className="border border-slate-600 w-1/6 text-left"><p className="m-1">Weight</p></th>
              <th className="border border-slate-600">Event</th>
            </tr>
          </thead>
          <tbody>
            {table.events?.map((event) => {
              return (
                <tr key={event._id} className="m-4">
                  <td className="border border-slate-600">
                    <p className="m-1">

                      {event.weight}
                    </p>
                  </td>
                  <td className="border border-slate-600">
                    <p className="m-1">

                      {event.name}
                    </p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table;