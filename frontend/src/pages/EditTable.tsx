import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useForm, useFieldArray } from 'react-hook-form';
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { updateTable, TableFormValues, getTable } from "../services/tableServices";

function EditTable() {
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors }, 
    setValue 
  } = useForm<TableFormValues>();
  const { id } = useParams<{id: string}>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'events',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    if (!id) {
      navigate('/login');
      return;
    }
    if (!userToken) {
      navigate('/login');
      return;
    }

    const fetchTable = async () => {
      const table = await getTable(id, userToken);
      
      setValue('name', table.name);
      setValue('private', table.private);
      if (table.events) {
        replace(table.events);
      }
      if (table.description) {
        setValue('description', table.description);
      }
    }

    fetchTable();
  }, [userToken, navigate, id, replace, setValue])



  const removeEvent = (index: number) => {
    // Always need at least one event.
    if (fields.length === 1) {
      return;
    }

    remove(index);
  }

  const addEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    append({name: '', weight: 1});
  }

  const onSubmit = handleSubmit(async (formData) => {
    console.dir(formData);
    if (!userToken) {
      dispatch(setError('You need to be logged in to do this.'));
      return;
    }
    await updateTable(formData, userToken);
  });

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-lg p-5">
      <h1 className="text-2xl text-center mb-5">Edit Table</h1>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-5">
          <div className="col-span-4">

            <label htmlFor="name" className="mr-2">Table Name</label>
          
            <input
              className="py-2 outline-none rounded-md form-input w-3/4"
              aria-invalid={errors.name ? "true" : "false" }
              { ...register("name", {required: "Name is required"}) }
              />
          
          </div>
          <div className="">
            <label htmlFor="private" className="mb-1 mx-2">Private</label>
            <input
              className="form-checkbox"
              type="checkbox"
              { ...register('private') }
            />
          </div>
          <div>
            { errors.name && (
              <p className="text-red-700 text-xs italic">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-left mt-2" >
            <span className="">Description <span className="text-gray-700 text-sm">(optional)</span></span>
            <textarea
              id="description"
              className="form-textarea mt-1 block w-full rounded-md" 
              rows={3}
              {...register('description')}
            />
          </label>
        </div>
        <div>
          <h2 className="text-lg my-5 font-bold">Events</h2>
          <table className="table-auto">
            <thead>
              <tr>
                <th>Weight</th>
                <th className="w-3/4">Event</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              { fields.map((event, index) => {
                return (<tr key={event.id}>
                  <td>
                    <input
                      className="w-32 form-input rounded-md outline-none"
                      type="number"
                      aria-invalid={errors.events && errors.events[index] && errors.events[index].weight ? "true" : "false"}
                      { ...register(`events.${index}.weight`, { 
                          required: "Event weight is required", 
                          max: { value: 100, message: "Weight cannot excede 100" }, 
                          min: { value: 1, message: 'Weight needs to be at least 1' },
                        })
                      }
                    />
                    {errors.events && errors.events[index] && errors.events[index].weight && (
                      <p className="text-red-700 text-xs italic">{ errors.events[index].weight?.message }</p>
                    )}
                  </td>
                  <td>

                    <input
                      className="w-full mx-2 form-input rounded-md outline-none"
                      type="text"
                      aria-invalid={errors.events && errors.events[index] && errors.events[index].name ? "true" : "false"}
                      { ...register(`events.${index}.name`, { required: "Event needs a name" }) }
                    />
                    {errors.events && errors.events[index] && errors.events[index].name && (
                      <p className="text-red-700 text-xs italic px-3">{ errors.events[index].name?.message }</p>
                    )}
                  </td>
                  <td>
                  <button className="bg-red-600 text-white rounded-md pb-1 px-3 mx-5" onClick={(e) => {e.preventDefault(); removeEvent(index);}}> - </button>
                  </td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>

        <button className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300 mr-3 mt-3" onClick={addEvent}>Add new</button>
        <button className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Submit</button>
      </form>
    </div>
  )
}

export default EditTable;