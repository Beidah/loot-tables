import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";


function Header() {
	const [hideMenu, setHideMenu] = useState(true);

	const getAuthStore = (state: RootState) => state.auth;
  const { user } = useSelector(getAuthStore);

	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();

	const onLogout = () => {
		dispatch(logout());
		navigate('/');
	}

	const toggleMenu = () => {
		setHideMenu(hideMenu => !hideMenu)
	}

  return (
		<nav className="bg-white shadow-lg">
			<div className="max-w-screen-2xl mx-auto px-4">
				<div className="flex justify-between">
					<div className="flex space-x-7">
						<div>
							{/* Website Logo  */}
							<Link to="/" className="flex items-center py-4 px-2">
								<span className="font-semibold text-gray-500 text-lg">Loot Tables</span>
							</Link>
						</div>
						{/* Primary Navbar items */}
						<div className="hidden md:flex items-center space-x-1">
							<Link to="/" className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold ">Home</Link>
							{ user &&
							// only show create table link if user is logged in
							<Link to="/tables/new" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">New Table</Link>
							}
						</div>
					</div>
					{/* Secondary Navbar items */}
					<div className="hidden md:flex items-center space-x-3 ">
						{
							user ? (
								<>
									<Link to={`/users/${user._id}`}>My Tables</Link>
									<button onClick={onLogout} className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300" >Logout</button>
								</>
							) : (
								<>
									<Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</Link>
									<Link to="/signup" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</Link>
								</>
							)
						}
					</div>
					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button className="outline-none mobile-menu-button">
						<svg className=" w-6 h-6 text-gray-500 hover:text-green-500 "
							x-show="!showMenu"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
							onClick={toggleMenu}
						>
							<path d="M4 6h16M4 12h16M4 18h16"></path>
						</svg>
					</button>
					</div>
				</div>
			</div>
			{/* mobile menu */}
			{ !hideMenu && 
			<div className="mobile-menu">
				<ul className="">
					<li><Link to="/tables/new" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">New Table</Link></li>
				</ul>
			</div>
			}
		</nav>
  )
}

export default Header;