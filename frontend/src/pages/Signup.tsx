import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register as registerUser, reset, selectAuth } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";

interface FormData {
  name: string,
  email: string,
  password: string,
  confirm_password: string,
}

function Signup() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
    const password = useRef('');
    password.current = watch('password', '');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isSuccess, isError, message } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isError) {
      // TODO: handle error
      dispatch(setError(message));
      console.error("Error:", message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = handleSubmit((formData) => {

    const { name, email, password } = formData;
    
    dispatch(registerUser({
      name,
      email,
      password
    }));
    
  })

  return (
    <div className="bg-slate-300 container mx-auto rounded-xl mt-5 max-w-lg shadow-lg p-5">
      <h1 className="text-4xl text-center mb-5">Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="block mb-1">Display Name</label>
          <input
            type="text"
            className="py-2 outline-none rounded-md w-full"
            aria-invalid={errors.name ? "true" : "false"}
            {
              ...register('name', {
                required: "Display name is required",
              })
            }
          />
          {
            errors.name &&
            <p className="text-red-700 text-xs italic">{errors.name.message}</p>
          }
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input 
            type="email"
            className="py-2 outline-none rounded-md w-full"
            aria-invalid={errors.email ? "true" : "false"}
            {
              ...register('email', {
                required: "Email is required",
              })
            }
          />
          {
            errors.email &&
            <p className="text-red-700 text-xs italic">{errors.email.message}</p>
          }
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password" 
            className="py-2 outline-none rounded-md w-full"
            aria-invalid={errors.password ? "true" : "false"}
            {
              ...register('password', {
                required: "password"
              })
            }
          />
          {
            errors.password &&
            <p className="text-red-700 text-xs italic">{errors.password.message}</p>
          }
        </div>
        <div>
          <label htmlFor="confirm_password" className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="py-2 outline-none rounded-md w-full"
            aria-invalid={errors.confirm_password ? "true" : "false"}
            {
              ...register('confirm_password', {
                validate: value => {
                  return value === password.current || "The passwords do not match"
                }
              })
            }
          />
          {
            errors.confirm_password &&
            <p className="text-red-700 text-xs italic">{errors.confirm_password.message}</p>
          }
        </div>
        <input type="submit" className="mt-4 w-full text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 py-2 px-2 text-lg" value="Sign Up" />
      </form>
    </div>
  )
}

export default Signup;