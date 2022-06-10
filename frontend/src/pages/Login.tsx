import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { register, reset, UserFormData } from "../features/auth/authSlice";


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const getAuthStore = (state: RootState) => state.auth;
  const { user, isLoading, isSuccess, isError, message } = useSelector(getAuthStore);

  useEffect(() => {
    if (isError) {
      // TODO: handle error
      console.error("Error:", message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, } = formData;
    
    const userData: UserFormData = {
      email,
      password
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="bg-slate-300 container mx-auto rounded-xl mt-5 max-w-lg shadow-lg p-5">
      <h1 className="text-4xl text-center mb-5">Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input onChange={handleChange} value={formData.email}  type="email" id="email" name="email" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input onChange={handleChange} value={formData.password}  type="password" id="password" name="password" className="py-2 outline-none rounded-md w-full" />
        </div>
        <input type="submit" className="mt-4 w-full rounded-md bg-green-700 text-white py-2 text-lg" value="Login" />
      </form>
    </div>
  )
}

export default Login;