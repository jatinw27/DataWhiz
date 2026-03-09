import { useEffect, useState } from "react";
import api from "../services/api";
import DataChart from "../component/DataChart.jsx";
import { useParams } from "react-router-dom";

export default function DatasetDashboard() {

  const [dashboard, setDashboard] = useState(null);
const {name} = useParams();

  useEffect(() => {

    api.get(`/api/dashboard/${name}`)
      .then(res => setDashboard(res.data));

  }, [name]);

  if (!dashboard) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Dataset Dashboard
      </h1>

      {/* INSIGHTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Insights
        </h2>

        {dashboard.insights?.map((i, idx) => (
         <p
  key={idx}
  className="bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-lg"
>
  💡 {i.text}
</p>
        ))}
      </div>

      {/* CHARTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Charts
        </h2>

        {dashboard.charts?.map((chart, idx) => (
          <div key={idx} className="mb-8">
            <DataChart
              data={dashboard.sampleData}
              chart={chart}
            />
          </div>
        ))}
      </div>

    </div>
  );
}