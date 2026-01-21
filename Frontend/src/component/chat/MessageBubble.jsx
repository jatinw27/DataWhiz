export default function MessageBubble({ text, sender, data, isGrouped }) {
  const isUser = sender === "user";

  return (
    <div
      className={`max-w-[80%] px-4 py-2 rounded-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      } ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      <div>{text}</div>

      {/* Render table only if data exists */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-2 overflow-x-auto">
          <table className="text-sm border border-gray-700">
            <thead>
              <tr>
                {Object.keys(data[0]).map(key => (
                  <th key={key} className="border px-2 py-1">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-2 py-1">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
