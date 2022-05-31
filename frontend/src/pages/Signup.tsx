
function Signup() {
  return (
    <div className="bg-slate-300 container mx-auto rounded-xl mt-5 max-w-lg shadow-lg p-5">
      <h1 className="text-4xl text-center mb-5">Sign Up</h1>
      <form>
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input type="text" id="name" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input type="email" id="email" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input type="password" id="password" className="py-2 outline-none rounded-md w-full" />
        </div>
        <div>
          <label htmlFor="password_confirm" className="block mb-1">Confirm Password</label>
          <input type="password" id="password_confirm" className="py-2 outline-none rounded-md w-full" />
        </div>
        <button className="mt-4 w-full rounded-md bg-green-700 text-white py-2 text-lg">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup;