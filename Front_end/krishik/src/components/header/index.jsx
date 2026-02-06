import { GoSearch } from "react-icons/go";
import { Link } from "react-router";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../footer./authcontext";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
      
      {/* Logo */}
      <div className="text-2xl font-bold italic tracking-widest text-green-600">
        Krishik Bazar
      </div>

      {/* Menu */}
      <ul className="flex items-center gap-8 font-medium text-gray-700">
        <li><Link to="/" className="hover:text-green-600">Home</Link></li>
        <li><Link to="/" className="hover:text-green-600">Products</Link></li>
        <li><Link to="/" className="hover:text-green-600">About Us</Link></li>
        <li><Link to="/" className="hover:text-green-600">Profile</Link></li>
      </ul>

      {/* Search */}
      <div className="flex items-center w-72 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
        <button className="text-gray-500 hover:text-green-600">
          <GoSearch size={18} />
        </button>
      </div>

      {/* Auth section */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Hello, <span className="font-semibold">{user.first_name} {user.last_name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
