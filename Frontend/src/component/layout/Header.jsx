import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { dark, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!dropdownRef.current?.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <header className="border-b border-gray-200 dark:border-gray-800 
    bg-white dark:bg-[#0d0d0d] 
    text-black dark:text-white transition-colors">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="font-bold text-lg">
          DataWhiz
        </Link>

        <div className="flex items-center gap-4">

          {/* 🌗 THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="hover:scale-110 transition"
          >
            {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* 👤 USER MENU */}
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2"
              >
                <FaUserCircle size={22} />
                <span className="text-sm">{user?.name}</span>
              </button>

              <div
                className={`absolute right-0 mt-2 w-44 
                bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-800 
                rounded-lg shadow-xl transition-all
                ${
                  open
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <button
                  onClick={() => navigate("/dashboard")}
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/chat")}
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Chat
                </button>

                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
