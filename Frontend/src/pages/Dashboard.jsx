import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import { Link } from "react-router-dom";

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </p>
      <h3 className="text-3xl font-bold">
        {value}
      </h3>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { sessions } = useChat();

  const totalChats = Object.keys(sessions || {}).length;

  const totalMessages = Object.values(sessions || {}).reduce(
    (acc, session) => acc + session.messages.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-black dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Here’s your DataWhiz dashboard overview.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Chats" value={totalChats} />
          <StatCard title="Total Messages" value={totalMessages} />
          <StatCard
            title="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/chat"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white"
            >
              Start New Chat
            </Link>

            <Link
              to="/chat"
              className="bg-gray-200 dark:bg-gray-800 hover:opacity-80 px-6 py-3 rounded-lg"
            >
              View Chat History
            </Link>

            <Link
              to="/"
              className="bg-gray-200 dark:bg-gray-800 hover:opacity-80 px-6 py-3 rounded-lg"
            >
              Go to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
