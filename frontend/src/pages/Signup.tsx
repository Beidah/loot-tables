import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, reset, selectAuth, UserFormData } from "../features/auth/authSlice";
import { setError } from "../features/err/errorSlice";


function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [passwordDoesNotMatch, setPasswordMatch] = useState(false);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirm_password } = formData;

    if (password !== confirm_password) {
      // TODO: Display error
      setPasswordMatch(true);
    } else {
      const userData: UserFormData = {
        name,
        email,
        password
      }

      dispatch(register(userData));
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
      <h1 className="text-4xl text-center mb-5">Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="block mb-1">Display Name</label>
          <input 
            onChange={handleChange} 
            value={formData.name} 
            type="text" 
            id="name" 
            name="name" 
            className="py-2 outline-none rounded-md w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input 
            onChange={handleChange} 
            value={formData.email}  
            type="email" id="email" 
            name="email" 
            className="py-2 outline-none rounded-md w-full" 
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input 
            onChange={handleChange} 
            value={formData.password}  
            type="password" 
            id="password" 
            name="password" 
            className="py-2 outline-none rounded-md w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className="block mb-1">Confirm Password</label>
          <input 
            onChange={handleChange} 
            value={formData.confirm_password}  
            type="password" id="confirm_password" 
            name="confirm_password" 
            className="py-2 outline-none rounded-md w-full"
            required
          />
          {
            passwordDoesNotMatch &&
            <p className="text-red-700 text-xs italic">Passwords do not match</p>
          }
        </div>
        <input type="submit" className="mt-4 w-full text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 py-2 px-2 text-lg" value="Sign Up" />
      </form>
    </div>
  )
}

export default Signup;