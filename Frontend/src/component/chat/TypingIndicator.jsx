export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl w-fit mt-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}
