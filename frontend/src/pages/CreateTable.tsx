import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useForm, useFieldArray } from 'react-hook-form';
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { submitTable, TableFormValues } from "../services/tableServices";



function CreateTable() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<TableFormValues>({
    defaultValues: {
      events: [
        { weight: 1, name: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'events',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userToken = useAppSelector(selectUserToken);

  useEffect(() => {
    if (!userToken) {
      navigate('/login');
    }
  }, [userToken, navigate])



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
    console.log(formData.description);
    const { results: data, error } = await submitTable(formData, userToken);

    if (error) {
      dispatch(setError(error));
    }

    if (data) {
      navigate(`/tables/${data._id}`);
    }
  });

  return (
    <div className="bg-slate-200 container mx-auto rounded-xl mt-5 max-w-4xl shadow-lg p-5">
      <h1 className="text-2xl text-center mb-5">Create Table</h1>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-5">
          <div className="col-span-4">

            <label htmlFor="name" className="mr-2">Table Name</label>
          
            <input
              id="name"
              className="py-2 outline-none rounded-md form-input w-3/4"
              aria-invalid={errors.name ? "true" : "false" }
              { ...register(
                "name", 
                {
                  required: "Name is required",
                  maxLength: { value: 20, message: "Name needs to be less than 20 characters"}
                }) 
              }
            />
          
          </div>
          <div className="">
            <label htmlFor="private" className="mb-1 mx-2">Private</label>
            <input
              id="private"
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
                    {errors.events && errors.events[index] && errors.events[index].name && (
                      <p className="text-red-700 text-xs italic px-3">{ errors.events[index].name?.message }</p>
                    )}
                    <input
                      className="w-full mx-2 form-input rounded-md"
                      type="text"
                      aria-invalid={errors.events && errors.events[index] && errors.events[index].name ? "true" : "false"}
                      { ...register(`events.${index}.name`, { required: "Event needs a name" }) }
                    />
                    
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

export default CreateTable;