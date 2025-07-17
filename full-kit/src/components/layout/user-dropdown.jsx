"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, UserCog } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { ensureLocalizedPathname } from "@/lib/i18n"

import LogoutButton from "../../app/[lang]/(plain-layout)/pages/admission/LogoutButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
// Menu structure from your Sidebar
const menu = {
  parent: [
    { href: "/pages/admission/children", label: "إضافة طفل", icon: Home },
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

export function UserDropdown({
  dictionary,
  locale,
  user
}) {
  const pathname = usePathname()
  const role = user?.role || "parent"
  const links = menu[role] || []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="User"
        >
          <Avatar className="size-9">
            <AvatarImage src={user?.avatar} alt="" />
            <AvatarFallback className="bg-transparent">
              {user?.name && getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info */}
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            <AvatarImage src={user?.avatar} alt="Avatar" />
            <AvatarFallback className="bg-transparent">
              {user?.name && getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dynamic Sidebar Links */}
        <DropdownMenuGroup className="max-h-[250px] overflow-auto">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <DropdownMenuItem
                asChild
                key={link.href}
                className={cn(isActive && "bg-muted font-bold")}
              >
                <Link href={ensureLocalizedPathname(link.href, locale)} className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Profile + Settings */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={ensureLocalizedPathname(user?.role === 'admin' ? "/pages/account/profile" : "/pages/admission/me", locale)}
            >
              <User className="me-2 size-4" />
              {dictionary.navigation.userNav.profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ensureLocalizedPathname("/pages/account/settings", locale)}
            >
              <UserCog className="me-2 size-4" />
              {dictionary.navigation.userNav.settings}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
