import React, { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
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
          <label htmlFor="name" className="block mb-1">Name</label>
          <input onChange={handleChange} value={formData.name} type="text" id="name" name="name" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input onChange={handleChange} value={formData.email}  type="email" id="email" name="email" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input onChange={handleChange} value={formData.password}  type="password" id="password" name="password" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="confirm_password" className="block mb-1">Confirm Password</label>
          <input onChange={handleChange} value={formData.confirm_password}  type="password" id="confirm_password" name="confirm_password" className="py-2 outline-none rounded-md w-full" />
        </div>
        <input type="submit" className="mt-4 w-full rounded-md bg-green-700 text-white py-2 text-lg" value="Sign Up" />
      </form>
    </div>
  )
}

export default Signup;