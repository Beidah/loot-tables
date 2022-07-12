import { Link } from "react-router-dom";
import { Table } from "../services/tableServices";

interface Props {
  table: Table,
  displayAuthor: boolean,
  onDelete?(): void,
}

function TableCard({ table, displayAuthor, onDelete }: Props) {

  return (
    <div className="rounded-md border border-slate-700 my-2 p-3">
      <h4><Link className="text-slate-700 underline text-lg" to={`/tables/${table._id}`}>{table.name}</Link></h4>
      { displayAuthor &&
        <h5 className="text-sm text-slate-700 italic mb-2">
          Created by:{' '}
          <Link className="underline" to={`/users/${table.user._id}`}>{table.user.name}</Link>
        </h5>
      }
      {table.description && <p>{table.description}</p>}
      {
        onDelete &&
        <div className="text-right">
          <Link to={`/tables/${table._id}/edit`} className="py-2.5 px-2 mr-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Edit</Link>
          <button className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300" onClick={onDelete}>
            Delete
          </button>
        </div>
      }
    </div>
  )
}

export default TableCard;