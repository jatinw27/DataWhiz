export default function DatasetInsights({ insights }) {

  if (!insights || insights.length === 0) {
    return (
      <div className="text-gray-400">
        No insights available
      </div>
    );
  }
console.log("CHARTS:", dashboard.charts);
  return (
        
    
    <div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">Smart Insights</h2>
<h3 className="text-sm font-semibold mb-2">
  {chart.column || chart.x}
</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {dashboard.insights?.slice(0, 6).map((i, idx) => (
      <div
        key={idx}
        className="bg-gray-50 p-3 rounded-lg border"
      >
        <p className="text-sm font-medium">
          {i.column}
        </p>
        <p className="text-xs text-gray-600">
          i.type === "topValues"
  ? `Top ${i.column}: ${i.values?.[0]?.[0]} (${i.values?.[0]?.[1]} times)`
        </p>

      </div>
    ))}
  </div>
</div>
  );
}