import { Link } from "react-router-dom";
import Header from "../component/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      <main className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          DataWhiz
        </h1>

        <p className="text-gray-400 max-w-2xl mb-8">
          Ask questions in natural language and instantly analyze your CSV files
          and databases. No SQL required.
        </p>

        <Link
          to="/chat"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-medium transition"
        >
          Start Chatting
        </Link>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl">
          <Feature title="Natural Language Queries" />
          <Feature title="CSV & Database Support" />
          <Feature title="AI-assisted Query Engine" />
        </div>
      </main>
    </div>
  );
}

function Feature({ title }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">
        Designed for real-world analytics workflows.
      </p>
    </div>
  );
}
