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
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const COLORS = ["#22c55e", "#4ade80", "#16a34a", "#15803d"];

export default function DataChart({ data, chart }) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const yKey = keys[1];

  //  LIMIT DATA 
  const limitedData = data.slice(0, 10);

  //  CHECK NUMERIC
  const isNumeric = limitedData.every(d => !isNaN(Number(d[yKey])));
  if (!isNumeric) {
    return (
      <p className="text-sm text-red-400">
        Cannot render chart: "{yKey}" is not numeric
      </p>
    );
  }

  // ================= BAR =================
  if (chart === "bar") {
    return (
      <div className="w-full h-[320px]">
        <ResponsiveContainer>
          <BarChart data={limitedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ================= LINE =================
  if (chart === "line") {
    return (
      <div className="w-full h-[320px]">
        <ResponsiveContainer>
          <LineChart data={limitedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ================= PIE =================
  if (chart === "pie") {
    return (
      <div className="w-full h-[320px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={limitedData}
              dataKey={yKey}
              nameKey={xKey}
              outerRadius={100}
              label
            >
              {limitedData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-400">
      Unsupported chart type
    </p>
  );
}