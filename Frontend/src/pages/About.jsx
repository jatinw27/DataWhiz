import Header from "../component/layout/Header";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-6">About DataWhiz</h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          <b>DataWhiz</b> is an intelligent data interaction platform that allows
          users to communicate with structured data using natural language.
        </p>

        <p className="text-gray-400 mb-6">
          The system integrates Natural Language Query (NLQ) processing,
          multi-database support (CSV, SQLite, MongoDB), and conversational AI
          to bridge the gap between technical databases and non-technical users.
        </p>

        <p className="text-gray-400">
          This project was independently designed and implemented with a focus on:
        </p>

        <ul className="list-disc list-inside mt-4 text-gray-300">
          <li>Human–AI interaction</li>
          <li>Natural language interfaces for data systems</li>
          <li>Scalable full-stack architecture</li>
          <li>Applied AI for real-world data analysis</li>
        </ul>
      </div>
    </div>
  );
}
