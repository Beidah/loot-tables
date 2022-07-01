import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useForm, useFieldArray } from 'react-hook-form';
import { selectUserToken } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";
import { submitTable } from "../services/tableServices";

export type TableFormValues = {
  name: string;
  private: boolean;
  events: {
    name: string;
    weight: number;
  }[];
}

function CreateTable() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<TableFormValues>({
    defaultValues: {
      name: '',
      events: [
        {
          name: '',
          weight: 1,
        }
      ],
      private: false,
  }});

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
                      className="w-full mx-2 form-input"
                      type="text"
                      aria-invalid={errors.events && errors.events[index] && errors.events[index].name ? "true" : "false"}
                      { ...register(`events.${index}.name`, { required: "Event needs a name" }) }
                    />
                    {errors.events && errors.events[index] && errors.events[index].name && (
                      <p className="text-red-700 text-xs italic px-3">{ errors.events[index].name?.message }</p>
                    )}
                  </td>
                  <td>
                    <button className="bg-red-600 text-white rounded-md pb-1 px-3 m-5" onClick={(e) => {e.preventDefault(); removeEvent(index);}}> - </button>
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