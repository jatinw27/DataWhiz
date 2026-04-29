import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

export default function DataChart({ data, chart }) {
  if (!data || data.length === 0) return null;

  // BAR CHART (grouped)
  if (chart === "bar" || chart?.type === "bar") {
    return (
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#22c55e" />
      </BarChart>
    );
  }

  // PIE CHART
  if (chart === "pie") {
    return (
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          outerRadius={100}
        >
          {data.map((_, i) => (
            <Cell key={i} fill="#22c55e" />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  // HISTOGRAM
  if (chart?.type === "histogram") {
    const values = data
      .map(d => Number(d[chart.x]))
      .filter(v => !isNaN(v));

    const binSize = 10;
    const freq = {};

    values.forEach(v => {
      const bin = Math.floor(v / binSize) * binSize;
      const label = `${bin}-${bin + binSize}`;
      freq[label] = (freq[label] || 0) + 1;
    });

    const chartData = Object.entries(freq).map(([range, count]) => ({
      label: range,
      value: count
    }));

    return (
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#22c55e" />
      </BarChart>
    );
  }

  return <p className="text-gray-400">Unsupported chart</p>;
}