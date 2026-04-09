import { useEffect, useState } from "react";
import api from "../services/api";
import DataChart from "../component/DataChart.jsx";
import { useParams } from "react-router-dom";

export default function DatasetDashboard() {

  const [dashboard, setDashboard] = useState(null);
const {name} = useParams();

  useEffect(() => {

    api.get(`/dashboard/${name}`)
      .then(res => {
        // console.log("api response: ", res.data)
        setDashboard(res.data)});

  }, [name]);

  if (!dashboard) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Dataset Dashboard
      </h1>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">Rows</p>
    <h2 className="text-xl font-bold">{dashboard.data?.length}</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">Columns</p>
    <h2 className="text-xl font-bold">
      {Object.keys(dashboard.stats || {}).length}
    </h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">Insights</p>
    <h2 className="text-xl font-bold">
      {dashboard.insights?.length}
    </h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">Charts</p>
    <h2 className="text-xl font-bold">
      {dashboard.charts?.length}
    </h2>
  </div>

</div>
<div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-xl shadow mb-6">
  <h2 className="text-lg font-semibold mb-2">
    🧠 AI Summary
  </h2>

  {dashboard.summary?.map((line, idx) => (
    <p key={idx} className="text-sm mb-1">
      {line}
    </p>
  ))}
</div>
{dashboard.aiSummary && (
  <div className="bg-black text-white p-5 rounded-xl shadow mb-6">
    <h2 className="text-lg font-semibold mb-2">
      🤖 AI Analysis
    </h2>
    <p className="text-sm whitespace-pre-line">
      {dashboard.aiSummary}
    </p>
  </div>
)}

      {/* INSIGHTS */}
      <div className="bg-white p-4 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-3">Smart Insights</h2>

  {dashboard.insights?.slice(0, 6).map((i, idx) => (
  <p key={idx} className="text-sm flex items-center gap-2">
    📊 <span className="font-medium">{i.column}:</span>{" "}
    {i.values?.[0]?.[0]}
  </p>
))}
</div>

      {/* CHARTS */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Charts
        </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {dashboard.charts?.map((chart, idx) => (
    <div
      key={idx}
      className="bg-white p-4 rounded-xl shadow"
    >
      
      <DataChart data={dashboard.data} chart={chart} />
    </div>
  ))}
</div>
      </div>

    </div>


  );

}