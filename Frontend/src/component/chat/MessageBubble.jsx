export default function MessageBubble({ text, sender, data, time, query }) {
  const isUser = sender === "user";

  return (
    <div
      className={`mb-3 max-w-[70%] px-4 py-2 rounded-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      <div className="text-sm">{text}</div>

      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-3 overflow-x-auto border border-gray-700 rounded">
         <table className="text-sm w-full border border-gray-700 rounded-lg overflow-hidden">
  <thead className="bg-gray-900">
    <tr>
      {Object.keys(data[0]).map(key => (
        <th key={key} className="px-3 py-2 border-b border-gray-700 text-left">
          {key}
        </th>
      ))}
    </tr>
  </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-3 py-2 border border-gray-700">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        
      )}
{query && (
  <details className="mt-2 text-sm">
    <summary className="cursor-pointer text-green-400 hover:underline">
      View generated query
    </summary>
    <pre className="mt-2 bg-black/60 p-3 rounded text-xs overflow-x-auto border border-gray-700">
      {query}
    </pre>
  </details>
)}
      {time && (
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {time}
        </div>
      )}
    </div>
  );
}
