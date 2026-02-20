import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header({ leftSlot }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {leftSlot}
          <Link to="/" className="font-bold text-lg tracking-tight">
            DataWhiz
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5">
          
          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {dark ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          {/* USER */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <FaUserCircle size={18} />
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#141414]
                border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden
                transition-all origin-top-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <button
    onClick={() => navigate("/dashboard")}
    className="w-full px-4 py-2.5 text-left text-sm
    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    Dashboard
  </button>

  <button
    onClick={() => navigate("/chat")}
    className="w-full px-4 py-2.5 text-left text-sm
    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    Chat
  </button>

  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

  <button
    onClick={logout}
    className="w-full px-4 py-2.5 text-left text-sm
    text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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