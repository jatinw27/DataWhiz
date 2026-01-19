import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-4">
        Data<span className="text-green-500">Whiz</span>
      </h1>

      <p className="text-gray-400 text-lg max-w-xl text-center mb-8">
        Ask questions directly from your data using natural language.
        Switch between AI chat and dataset-based insights seamlessly.
      </p>

      <div className="flex gap-4">
        <Link
          to="/chat"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium"
        >
          Start Chatting →
        </Link>

        <a
          href="https://github.com/jatinw27"
          target="_blank"
          className="border border-gray-600 px-6 py-3 rounded-lg"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
