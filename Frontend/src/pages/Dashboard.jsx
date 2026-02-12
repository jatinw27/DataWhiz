import Header from "../component/layout/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Total Chats" value="24" />
          <Card title="Datasets Connected" value="3" />
          <Card title="AI Usage Today" value="128 queries" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
