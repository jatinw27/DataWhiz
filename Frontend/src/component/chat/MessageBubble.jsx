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
    <div
      className={`max-w-[70%] px-4 py-2 rounded-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      } ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      <div className="text-sm leading-relaxed">{text}</div>

      {/* DATA TABLE */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-3 overflow-x-auto border border-gray-700 rounded">
          <table className="text-sm w-full border-collapse">
            <thead className="bg-gray-900">
              <tr>
                {Object.keys(data[0]).map(key => (
                  <th
                    key={key}
                    className="px-3 py-2 border-b border-gray-700 text-left"
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

          {/* SQL QUERY VIEW */}
          {query && (
            <details className="mt-2 text-xs text-gray-300">
              <summary className="cursor-pointer text-green-400">
                View generated query
              </summary>
              <pre className="mt-2 bg-black/70 p-3 rounded overflow-x-auto">
                {query}
              </pre>
            </details>
          )}
        </div>
      )}
{sender === "user" && (
  <div className="text-[10px] text-right mt-1">
    {status === "sending" && (
      <span className="text-gray-300">Sending…</span>
    )}
    {status === "sent" && (
      <span className="text-gray-400">Sent</span>
    )}
    {status === "error" && (
      <span className="text-red-400">Failed</span>
    )}
  </div>
)}

      {sender !== "user" && time && (
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {time}
        </div>
      )}
    </div>
    
  );
}
