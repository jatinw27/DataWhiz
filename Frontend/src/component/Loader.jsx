export default function Loader({ text = "Loading..." }) {
  return (
    <div className="text-gray-400 text-sm px-4 py-2">
      {text}
    </div>
  );
}
