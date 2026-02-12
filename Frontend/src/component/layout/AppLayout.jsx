import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}
