import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function DataChart({ data, chart }) {

<h3 className="font-semibold mb-2">{chart.column}</h3>

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400">No data for chart</p>;
  }

  // 🔥 HISTOGRAM (numeric column)
  if (chart.type === "histogram") {

    const values = data
      .map(d => Number(d[chart.x]))
      .filter(v => !isNaN(v));
const binSize = 10; // group into ranges
const freq = {};

values.forEach(v => {
  const bin = Math.floor(v / binSize) * binSize;
  const label = `${bin}-${bin + binSize}`;

  freq[label] = (freq[label] || 0) + 1;
});

const chartData = Object.entries(freq).map(([range, count]) => ({
  range,
  count
}));

    return (
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    );
  }

  // 🔥 TOP VALUES (categorical)
  if (chart.type === "topValues") {
    return (
      <BarChart width={500} height={300} data={chart.values}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    );
  }

  return <p>Unsupported chart</p>;
}