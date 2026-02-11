import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="font-bold text-lg text-white">
          DataWhiz
        </Link>

        {/* RIGHT SIDE */}
        {!isAuthenticated ? (
          <div className="flex gap-4 text-sm">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <FaUserCircle size={22} />
              <span className="text-sm">{user?.name}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded shadow-lg">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/chat");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
                >
                  Chat
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
