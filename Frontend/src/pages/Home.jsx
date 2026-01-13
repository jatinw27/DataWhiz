import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        DataWhiz
      </h1>

      <p className="text-gray-400 max-w-xl text-center mb-6">
        Ask natural language questions on your datasets.
        Upload CSVs, query SQL, MongoDB and more using AI.
      </p>

      <Link
        to="/chat"
        className="bg-green-600 px-6 py-3 rounded-full hover:bg-green-700 transition"
      >
        Start Analyzing →
      </Link>
    </div>
  );
}
