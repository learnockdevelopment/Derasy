"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
  Home,
  Baby,
  Brain,
  School,
  Settings,
  Inbox,
  Users,
  FileText,
  ShieldCheck,
} from "lucide-react";

const menu = {
  parent: [
    { href: "/pages/admission/children", label: "الرئيسية", icon: <Home className="w-5 h-5" /> },
    { href: "/pages/admission/children/my", label: "الأطفال", icon: <Baby className="w-5 h-5" /> },
    { href: "/pages/admission/children/my/analysis", label: "تحليل الذكاء", icon: <Brain className="w-5 h-5" /> },
    { href: "/pages/admission/children/my/suggestions", label: "اقتراحات الذكاء", icon: <Brain className="w-5 h-5" /> },
    { href: "/pages/admission/children/my/applications", label: "طلباتي", icon: <Inbox className="w-5 h-5" /> },
    { href: "/pages/admission/schools", label: "المدارس", icon: <School className="w-5 h-5" /> },
    { href: "/pages/admission/me", label: "الإعدادات", icon: <Settings className="w-5 h-5" /> },
  ],

  school_owner: [
    { href: "/pages/admission/me/schools", label: "مدارسي", icon: <School className="w-5 h-5" /> },
    { href: "/pages/admission/me/schools/applications", label: "الطلبات", icon: <Inbox className="w-5 h-5" /> },
    { href: "/pages/admission/me", label: "الإعدادات", icon: <Settings className="w-5 h-5" /> },
  ],
  moderator: [
    { href: "/pages/moderation/tasks", label: "المهام", icon: <ShieldCheck className="w-5 h-5" /> },
    { href: "/pages/admission/me", label: "الإعدادات", icon: <Settings className="w-5 h-5" /> },
  ],
  admin: [
    { href: "/pages/admin/users", label: "المستخدمين", icon: <Users className="w-5 h-5" /> },
    { href: "/pages/admin/schools", label: "المدارس", icon: <School className="w-5 h-5" /> },
    { href: "/pages/admin/logs", label: "السجلات", icon: <FileText className="w-5 h-5" /> },
    { href: "/pages/admission/me", label: "الإعدادات", icon: <Settings className="w-5 h-5" /> },
  ],
};

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "parent";
  const links = menu[role];

  return (
    <aside className="w-64 bg-white p-6 hidden md:block sticky top-0 h-screen">
      <h2 className="text-xl font-bold mb-6 text-blue-700">
        لوحة تحكم {role === "admin" ? "الإدارة" : "المستخدم"}
      </h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-start gap-2 text-gray-700 hover:text-blue-600 ${pathname === link.href ? "font-bold text-blue-700" : ""
              }`}
          >
            {link.icon}
            <span>{link.label}</span>

          </Link>
        ))}
        <div className="mt-12 border-t pt-4">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
