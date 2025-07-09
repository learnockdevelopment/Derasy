"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar as SidebarWrapper,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import LogoutButton from "./LogoutButton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

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
} from "lucide-react"

const menu = {
  parent: [
    { href: "/pages/admission/children", label: "الرئيسية", icon: Home },
    { href: "/pages/admission/children/my", label: "الأطفال", icon: Baby },
    { href: "/pages/admission/children/my/analysis", label: "تحليل الذكاء", icon: Brain },
    { href: "/pages/admission/children/my/suggestions", label: "اقتراحات الذكاء", icon: Brain },
    { href: "/pages/admission/children/my/applications", label: "طلباتي", icon: Inbox },
    { href: "/pages/admission/schools", label: "المدارس", icon: School },
    { href: "/pages/admission/me", label: "الإعدادات", icon: Settings },
  ],
  school_owner: [
    { href: "/pages/admission/me/schools", label: "مدارسي", icon: School },
    { href: "/pages/admission/me/schools/applications", label: "الطلبات", icon: Inbox },
    { href: "/pages/admission/me", label: "الإعدادات", icon: Settings },
  ],
  moderator: [
    { href: "/pages/moderation/tasks", label: "المهام", icon: ShieldCheck },
    { href: "/pages/admission/me", label: "الإعدادات", icon: Settings },
  ],
  admin: [
    { href: "/pages/admin/users", label: "المستخدمين", icon: Users },
    { href: "/pages/admin/schools", label: "المدارس", icon: School },
    { href: "/pages/admin/logs", label: "السجلات", icon: FileText },
    { href: "/pages/admission/me", label: "الإعدادات", icon: Settings },
  ],
}

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const role = user?.role || "parent"
  const links = menu[role]

  return (
    <SidebarWrapper side="right" className="hidden md:flex w-64 bg-background h-screen sticky">
      <SidebarHeader>
        <Link
          href="/"
          className="w-fit flex items-center text-foreground font-black p-2 pb-0 mb-2"
        >
          <Image
            src="/images/icons/shadboard.svg"
            alt=""
            height={24}
            width={24}
            className="dark:invert me-2"
          />
          <span>دراسي</span>
        </Link>
      </SidebarHeader>

      <ScrollArea className="flex-1 overflow-y-auto">
        <SidebarContent>
          <SidebarMenu>
            {links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={link.href} className="w-full flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 w-full border-t px-4 py-3 bg-background">
        <LogoutButton />
      </div>
    </SidebarWrapper>
  )
}
