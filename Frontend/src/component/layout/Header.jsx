import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">DataWhiz</span>

        {user && (
          <div className="relative">
            <FaUserCircle
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(prev => !prev)}
            />

            {open && (
              <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded w-40">
                <div className="px-4 py-2 text-sm text-gray-400">
                  {user.name}
                </div>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-800"
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
