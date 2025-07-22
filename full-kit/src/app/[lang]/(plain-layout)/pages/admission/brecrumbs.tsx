"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter((part) => part !== "");

  const getBreadcrumbName = (segment: string) => {
    // You can customize this mapping
    const names: Record<string, string> = {
      admission: "القبول",
      me: "حسابي",
      schools: "المدارس",
      dashboard: "لوحة التحكم",
    };
    return names[segment] || segment;
  };

  return (
    <nav className="text-sm text-gray-600 flex items-center gap-2 mb-4 mt-7 bg-gray-100 p-3 rounded-xl" aria-label="Breadcrumb">
      <Link href="/" className="hover:underline text-blue-600">الرئيسية</Link>
      {pathParts.map((part, index) => {
        const href = "/" + pathParts.slice(0, index + 1).join("/");
        const name = getBreadcrumbName(part);
        return (
          <span key={href} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <Link href={href} className="hover:underline">{name}</Link>
          </span>
        );
      })}
    </nav>
  );
}
