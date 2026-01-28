export default function Loader({ text = "Thinking..." }) {
  return (
    <div className="mt-4 max-w-[60%] bg-gray-800 rounded-xl p-4 animate-pulse">
      <div className="h-3 bg-gray-600 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-600 rounded w-1/2" />
      <div className="text-xs text-gray-400 mt-2">{text}</div>
    </div>
  );
}
