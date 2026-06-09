import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout({
  children,
}) {
  return (
    <div className="flex bg-[#0D1117] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}