import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-lg font-bold">
          DataWhiz
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/chat"
            className="text-sm text-gray-300 hover:text-white"
          >
            Chat
          </Link>
          <FaUserCircle size={24} />
        </div>
      </div>
    </header>
  );
}
