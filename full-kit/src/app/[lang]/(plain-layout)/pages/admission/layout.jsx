import { getCurrentUser } from "@/lib/getCurrentUser";
import Sidebar from "./Sidebar"; // client component

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex bg-gray-100 w-full font-[Cairo]">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-blue-700">📋 لوحة التحكم</h1>
          <div className="text-sm text-gray-500">مرحباً، {user?.name}</div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">{children}</main>

        <footer className="bg-white shadow-inner py-4 px-6 text-center text-sm text-gray-500 sticky bottom-0 z-10">
          © {new Date().getFullYear()} منصة دراسي – جميع الحقوق محفوظة.
        </footer>
      </div>
    </div>
  );
}
