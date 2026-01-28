import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">DataWhiz</span>

        <div className="relative group">
          <FaUserCircle size={26} className="cursor-pointer" />

          <div className="absolute right-0 mt-2 hidden group-hover:block bg-gray-900 border border-gray-800 rounded w-40">
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-800">
              Profile
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-800">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
