import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100 w-full font-[Cairo]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-6 text-blue-700">لوحة التحكم</h2>
        <nav className="space-y-4 text-right">
          <a href="/pages/admission/children" className="block text-gray-700 hover:text-blue-600">🏠 الرئيسية</a>
          <a href="/pages/admission/children/my" className="block text-gray-700 hover:text-blue-600">👶 الأطفال</a>
          <a href="/pages/admission/children/my/analysis" className="block text-gray-700 hover:text-blue-600">🧠 تحليل الذكاء الاصطناعي</a>
          <a href="/dashboard/schools" className="block text-gray-700 hover:text-blue-600">🏫 المدارس</a>
          <a href="/pages/admission/me" className="block text-gray-700 hover:text-blue-600">⚙️ الإعدادات</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-blue-700">📋 لوحة التحكم</h1>
          {/* Future: Add profile menu or logout button */}
        </header>

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-white shadow-inner py-4 px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} منصة تقديم المدارس – جميع الحقوق محفوظة.
        </footer>
      </div>
    </div>
  );
}
