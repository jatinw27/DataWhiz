import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

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

  // detect keys automatically
  const labelKey = Object.keys(data[0])[0];
  const valueKey = Object.keys(data[0])[1];

  // normalize data
  const normalized = data.map(item => ({
    label: item.group || item[labelKey],
    value: item.count || item[valueKey],
  }));

  //  sort + limit (TOP 10)
  const sorted = [...normalized]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const labels = sorted.map(i => i.label);
  const values = sorted.map(i => i.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
        backgroundColor: '#22c55e',
        borderRadius: 6,
      },
    ],
  };

  //  SMART CHART SWITCH
  if (sorted.length <= 5) {
    // small dataset → pie chart
    return (
      <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
        <Pie data={chartData} />
      </div>
    );
  }

  // default → bar chart
  return (
    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
      <Bar
  data={chartData}
  options={{
    responsive: true,
    indexAxis: "y", //  horizontal

    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb", // light text
        },
      },
      title: {
        display: true,
        text: "Top Countries by Customers",
        color: "#e5e7eb",
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          color: "#374151",
        },
      },
      y: {
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          color: "#374151",
        },
      },
    },
  }}
/>
    </div>
  );
}