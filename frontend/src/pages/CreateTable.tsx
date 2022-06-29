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
      navigate('/');
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
        <div className="w-1/2 inline">
          <label htmlFor="name" className="mb-1 mr-2">Table Name</label>
          <input
            className="py-2 outline-none rounded-md w-1/2 form-input"
            aria-invalid={errors.name ? "true" : "false" }
            { ...register("name", {required: true}) }
          />
          { errors.name && (
            <span>Name is required</span>
          )}
        </div>
        <div className="w-1/2 inline">
          <label htmlFor="private" className="mb-1 mx-2">Private</label>
          <input
            className="form-checkbox"
            type="checkbox"
            { ...register('private') }
          />
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
                      aria-invalid={errors.events && errors.events[index].weight ? "true" : "false"}
                      { ...register(`events.${index}.weight`, { 
                          required: true, max: 100, min: 1
                        })
                      }
                    />
                    {errors.events && errors.events[index].weight && (
                      <span>{ errors.events[index]?.weight?.type }</span>
                    )}
                  </td>
                  <td>

                    <input
                      className="w-full mx-2 form-input"
                      type="text"
                      aria-invalid={errors.events && errors.events[index].name ? "true" : "false"}
                      { ...register(`events.${index}.name`, { required: true }) }
                    />
                    {errors.events  && errors.events[index].name?.type === 'required' && (
                      <span>This field is required</span>
                    )}
                  </td>
                  <td>
                    <button className="bg-red-600 text-white rounded-md pb-1 px-3 m-5" onClick={(e) => {e.preventDefault(); removeEvent(index);}}> - </button>
                  </td>
                </tr>);
              })}
            </tbody>
          </table>
          <button onClick={addEvent}>Add new</button>
        </div>

        <button>Submit</button>
      </form>
    </div>
  )
}

export default CreateTable;