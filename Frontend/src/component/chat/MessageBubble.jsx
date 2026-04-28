import { motion } from "framer-motion";
// import DataChart from "../DataChart.jsx";
import ChartRenderer from "../ChartRenderer.jsx";

export default function MessageBubble({
  text,
  sender,
  data,
  chart,
  time,
  status,
  isGrouped,
}) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md
        ${
          isUser
            ? "ml-auto bg-gradient-to-br from-green-600 to-green-700 text-white"
            : "bg-gray-100 text-black border border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-100 dark:border-gray-800"
        }
        ${isGrouped ? "mt-1" : "mt-4"}
      `}
    >

      {/* TEXT */}
      {text && (
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      )}

      {/* DATA TABLE */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-4 bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
          <table className="text-sm w-full">
            <thead className="bg-gray-900">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-3 py-2 text-left text-gray-400">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t border-gray-800">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-3 py-2">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHART */}
      {chart && data && Array.isArray(data) && data.length > 0 && (
  <div className="mt-4">
    <ChartRenderer data={data} chartType={chart} />
  </div>
)}

{insights && (
  <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm">
    💡 {insights}
  </div>
)}
      {/* STATUS */}
      {isUser && (
        <div className="text-[10px] text-right mt-2 text-gray-300">
          {status === "sending" && "Sending…"}
          {status === "sent" && "Sent"}
          {status === "error" && "Failed"}
        </div>
      )}

      {/* TIME */}
      {time && (
        <div className="text-[10px] text-right mt-1 text-gray-400">
          {time}
        </div>
      )}
    </motion.div>
  );
}