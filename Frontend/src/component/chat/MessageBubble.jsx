export default function MessageBubble({ text, sender, data, time }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-800 text-gray-100 rounded-bl-none"
        }`}
      >
        {text}

        {Array.isArray(data) && data.length > 0 && (
          <div className="mt-3 overflow-x-auto border border-gray-700 rounded">
            <table className="text-xs w-full">
              <thead className="bg-gray-900">
                <tr>
                  {Object.keys(data[0]).map(k => (
                    <th key={k} className="px-2 py-1">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-2 py-1">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {time && (
          <div className="text-[10px] text-gray-400 mt-1 text-right">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
