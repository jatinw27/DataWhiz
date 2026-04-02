import { Link } from "react-router-dom";
import Header from "../component/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      
      <Header />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Talk to Your Data with{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            DataWhiz
          </span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
          Upload CSV files, connect databases, and ask natural language
          questions. Get instant AI-powered insights without writing SQL.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link
            to="/chat"
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition"
          >
            Start Chatting →
          </Link>

          <Link
            to="/register"
            className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg font-medium transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        <Feature
          title="📊 Smart Data Chat"
          text="Ask questions like 'How many users?' or 'Average age' and get structured results instantly."
        />

        <Feature
          title="🤖 AI Assistant"
          text="Use AI mode for explanations, reasoning, debugging help, and general assistance."
        />

        <Feature
          title="⚡ Multi-Source Support"
          text="Supports CSV, SQLite and MongoDB — everything in one powerful interface."
        />
      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-green-600 transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
