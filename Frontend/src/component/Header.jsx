import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">DataWhiz</span>

        <div className="relative">
          <FaUserCircle
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(prev => !prev)}
          />

          {open && (
            <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded w-40 shadow-lg">
              
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-800">
                Profile
              </button>

              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-800"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
