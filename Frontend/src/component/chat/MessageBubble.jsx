export default function MessageBubble({ text, sender, data, time }) {
  const isUser = sender === "user";

  return (
    <div
      className={`mb-3 max-w-[80%] px-4 py-2 rounded-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      <div className="text-sm">{text}</div>

      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-3 overflow-x-auto border border-gray-700 rounded">
          <table className="text-xs w-full border-collapse">
            <thead className="bg-gray-900">
              <tr>
                {Object.keys(data[0]).map(key => (
                  <th key={key} className="px-2 py-1 border">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-2 py-1 border">
                      {String(val)}
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
  );
}
