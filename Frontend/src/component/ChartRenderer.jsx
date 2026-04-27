import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ChartRenderer({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-400">No chart data available</p>
    );
  }

  // fallback keys (VERY IMPORTANT)
  const labelKey = Object.keys(data[0])[0];
  const valueKey = Object.keys(data[0])[1];

  // sort + limit 
const sorted = [...data]
  .sort((a, b) => (b.count || b[valueKey]) - (a.count || a[valueKey]))
  .slice(0, 10);

const labels = sorted.map(item => item.group || item[labelKey]);
const values = sorted.map(item => item.count || item[valueKey]);

  const chartData = {
    
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
      },
    ],
  };

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
    <Bar 
  data={chartData} 
  options={{
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }}
/>
    </div>
  );
}