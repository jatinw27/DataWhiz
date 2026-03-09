import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DataChart({ data, chart }) {

  // safety checks
  if (!chart || !data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey={chart.x} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={chart.y} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}