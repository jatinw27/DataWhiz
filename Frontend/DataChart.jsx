import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function DataChart({ data, chart }) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const yKey = keys[1];

  if (chart === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chart === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line dataKey={yKey} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chart === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey={yKey} nameKey={xKey} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}