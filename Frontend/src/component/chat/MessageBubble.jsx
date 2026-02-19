import { motion } from "framer-motion";

export default function MessageBubble({
  text,
  sender,
  data,
  time,
  query,
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
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>

      {/* DATA TABLE */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-700">
          <table className="text-sm w-full border-collapse">
            <thead className="bg-black/40">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-3 py-2 text-left border-b border-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="odd:bg-black/20">
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="px-3 py-2 border-b border-gray-800"
                    >
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* QUERY VIEW */}
          {query && (
            <details className="mt-3 text-xs text-gray-400 px-3 pb-3">
              <summary className="cursor-pointer text-green-400 hover:underline">
                View generated query
              </summary>
              <pre className="mt-2 bg-black/70 p-3 rounded overflow-x-auto text-xs">
                {query}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* STATUS (only for user messages) */}
      {sender === "user" && (
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
