export default function MessageBubble({ text, sender, data, time, query }) {
  const isUser = sender === "user";

  return (
    <div
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-800 text-gray-100 rounded-bl-sm"
        }`}
      >
        <div className="text-sm leading-relaxed">{text}</div>

        {/* Data table */}
        {Array.isArray(data) && data.length > 0 && (
          <div className="mt-4 overflow-x-auto border border-gray-700 rounded-lg">
            <table className="text-sm w-full">
              <thead className="bg-gray-900">
                <tr>
                  {Object.keys(data[0]).map(key => (
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
                  <tr key={i} className="hover:bg-gray-900/40">
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 border-t border-gray-800"
                      >
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Generated query */}
        {query && (
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer text-green-400 hover:underline">
              View generated query
            </summary>
            <pre className="mt-2 bg-black/60 p-3 rounded border border-gray-700 overflow-x-auto">
              {query}
            </pre>
          </details>
        )}

        {time && (
          <div className="text-[10px] text-gray-400 mt-2 text-right">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
