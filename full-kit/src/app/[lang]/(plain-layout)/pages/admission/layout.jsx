import { getCurrentUser } from "@/lib/getCurrentUser";
import Sidebar from "./Sidebar"; // client component
import { LandingHeader } from "../landing/_components/layout/landing-header";
import { getDictionary } from "@/lib/get-dictionary";

export default async function DashboardLayout({ children, params }) {
  const user = await getCurrentUser();
  const dictionary = await getDictionary(params.lang);

  const safeUser = user
    ? {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    : null;

  return (
    <div className="min-h-screen flex w-full font-[Cairo]">
      {/* {user && <Sidebar user={safeUser} />} */}

      <div className="flex-1 flex flex-col w-full">
        <LandingHeader dictionary={dictionary} dashboard={false} user={safeUser} />

        {/* 🌟 Branding Slogan Banner */}
        <div className="bg-white border-y border-gray-200 py-6 px-4 text-center shadow-sm mt-15">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            نحن منصّة دراسي – نُعلّم، نُرشد، ونفتح أبواب المستقبل.
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            نسعى لتمكين الطلاب، وتسهيل الوصول إلى التعليم المتميز.
          </p>
        </div>

        <main className="p-6 flex-1 overflow-y-auto">{children}</main>

        <footer className="bg-background text-foreground shadow-inner py-4 px-6 text-center text-sm text-gray-500 sticky bottom-0 z-10">
          © {new Date().getFullYear()} منصة دراسي – جميع الحقوق محفوظة.
        </footer>
      </div>
    </div>
  );
}
