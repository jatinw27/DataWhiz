import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Talk to Your Data with{" "}
          <span className="text-green-500">DataWhiz</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Upload CSV files, ask natural language questions, and get instant
          insights — powered by AI.
        </p>

        <Link
          to="/chat"
          className="inline-block bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium"
        >
          Start Chatting →
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">
        <Feature
          title="📊 Data Chat"
          text="Ask questions like 'How many users?' or 'Average age' directly from your data."
        />
        <Feature
          title="🤖 AI Chat"
          text="General AI assistant for explanations, help, and reasoning."
        />
        <Feature
          title="⚡ Fast & Simple"
          text="No SQL required. Upload, ask, and get answers instantly."
        />
      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}
