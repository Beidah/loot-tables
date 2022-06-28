import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { getTable, Table as LootTable } from "../services/tableServices";

function Table() {
  const [table, setTable] = useState<LootTable>();
  const [event, setEvent] = useState('');
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    const fetchTable = async () => {
      if (id) {
        const { data, error } = await getTable(id, userToken);

        if (error) {
          dispatch(setError(error));
        }

        if (data) {
          setTable(data);
        }
      } else {
        navigate('/');
      }
    }
    
    fetchTable();
  }, [id, navigate, dispatch, userToken]);

  if (!table) {
    return <></>
  }

  const roll = () => {
    if (table && table.table) {
      let items = table.table;
      let i: number;

      let weights: number[] = [];

      for (i = 0; i < items.length; i ++) {
        weights[i] =items[i].weight + (weights[i - 1] || 0);
      }

      const random = Math.random() * weights[weights.length - 1];

      for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) break;
      }

      setEvent(items[i].event);
    }
  }

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-2xl p-5">
      <h3 className="text-2xl text-center mb-5">{table.name}</h3>
      <div className="">
        <div>
          <p>{event}</p>
        </div>
        <button onClick={roll} className="float-right py-1 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 mb-2">Roll</button>
        <table className="table table-auto border border-collapse w-full">
          <thead>
            <tr>
              <th className="border border-slate-600 w-1/6 text-left"><p className="m-1">Weight</p></th>
              <th className="border border-slate-600">Event</th>
            </tr>
          </thead>
          <tbody>
            {table.table?.map((event) => {
              return (
                <tr className="m-4">
                  <td className="border border-slate-600">
                    <p className="m-1">

                      {event.weight}
                    </p>
                  </td>
                  <td className="border border-slate-600">
                    <p className="m-1">

                      {event.event}
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