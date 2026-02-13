import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const navigate = useNavigate();
const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 
    bg-white dark:bg-[#0d0d0d] 
    text-black dark:text-white transition-colors">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="font-bold text-lg">
          DataWhiz
        </Link>

        <div className="flex items-center gap-4">

          {/* 🌗 Theme Toggle */}
          <button
            onClick={() => setDark(prev => !prev)}
            className="hover:scale-110 transition"
          >
            {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

 {isAuthenticated && (
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setOpen(prev => !prev)}
      className="flex items-center gap-2"
    >
      <FaUserCircle size={22} />
      <span className="text-sm">{user?.name}</span>
    </button>

    {/* Animated Dropdown */}
    <div
      className={`absolute right-0 mt-2 w-44 
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-800 
      rounded-lg shadow-xl 
      transition-all duration-200 origin-top-right
      ${
        open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
    >
      <button
        onClick={() => {
          setOpen(false);
          navigate("/dashboard");
        }}
        className="block w-full text-left px-4 py-2 text-sm 
        hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Dashboard
      </button>

      <button
        onClick={() => {
          setOpen(false);
          navigate("/chat");
        }}
        className="block w-full text-left px-4 py-2 text-sm 
        hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Chat
      </button>

      <button
        onClick={() => {
          setOpen(false);
          logout();
        }}
        className="block w-full text-left px-4 py-2 text-sm text-red-500 
        hover:bg-gray-100 dark:hover:bg-gray-800"
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
