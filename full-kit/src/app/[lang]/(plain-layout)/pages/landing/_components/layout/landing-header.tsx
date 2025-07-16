"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { LogIn } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { headerNavigationData } from "../../_data/header-navigation"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, isActivePathname } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { LanguageDropdown } from "@/components/language-dropdown"
import { ModeDropdown } from "@/components/mode-dropdown"
import { LandingSidebar } from "./landing-sidebar"
import { UserDropdown } from "@/components/layout/user-dropdown"

export function LandingHeader({ dictionary, dashboard = false, user }: { dictionary: DictionaryType, dashboard?: boolean, user?: { name?: string; email?: string; avatar?: string } }) {
  const pathname = usePathname()
  const params = useParams()
  const [fullPathname, setFullPathname] = useState("")
  const [hasToken, setHasToken] = useState(false)

  const locale = params.lang as LocaleType

  useEffect(() => {
    setFullPathname(pathname + window.location.hash)

    // Check for token in cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
    setHasToken(!!token)
  }, [params, pathname])

  return (
    <header className="fixed top-5 z-50 w-full  mx-auto flex justify-content-center" dir="rtl">
      <div className={`container grid grid-cols-${dashboard ? "2" : "3"} rounded-4xl  bg-background border-b border-sidebar-border items-center gap-2 py-2.5 py-3 shadow-lg `}>
        <LandingSidebar fullPathname={fullPathname} />
        {dashboard || (
          <Link
            href="/"
            className="place-self-center w-fit flex text-foreground font-black hover:text-primary/90 lg:place-self-auto"
          >
            <Image
              src="/images/icons/shadboard.svg"
              alt=""
              height={24}
              width={24}
              className="dark:invert ms-2"
            />
            <span>دراسي</span>
          </Link>
        )}
        <nav className="hidden lg:block">
          <ul className="place-self-center flex gap-2">
            {headerNavigationData.map((nav) => {
              const isActive = isActivePathname(nav.href, fullPathname, true)
              return (
                <li key={nav.href}>
                  <Link
                    href={nav.href}
                    className={buttonVariants({
                      variant: isActive ? "secondary" : "ghost",
                    })}
                  >
                    {nav.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="place-self-end flex gap-x-2">
          <ModeDropdown dictionary={dictionary} />
          <LanguageDropdown dictionary={dictionary} />

          {hasToken ? (
            <UserDropdown locale={locale} dictionary={dictionary} user={user || {}} />
          ) : (
            <Link
              href={ensureLocalizedPathname("/sign-in", locale)}
              className={cn(buttonVariants(), "hidden lg:flex")}
            >
              <LogIn className="ms-2 h-4 w-4" />
              <span>تسجيل</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}
