'use client'

import Image from "next/image"
import Link from "next/link"

import { footerNavigationData } from "../../_data/footer-navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t-[1px] border-sidebar-border text-right" dir="rtl">
      <div className="container flex flex-wrap justify-between gap-6 py-20 md:px-6">
        <section className="max-w-prose w-full mb-3 space-y-1.5 md:w-auto">
          <Link href="/" className="w-fit flex text-foreground font-black mb-6">
            {/* Logo (optional) */}
            {/* <Image
              src="/images/icons/shadboard.svg"
              alt="Logo"
              height={24}
              width={24}
              className="ms-2 dark:invert"
            /> */}
            <span>دراسي</span>
          </Link>
          <h3 className="font-semibold leading-none tracking-tight">
            اشترك في النشرة البريدية
          </h3>
          <p className="text-sm text-muted-foreground">
            نصائح، وأدلة تقنية، وأفضل الممارسات — مرتين في الشهر.
          </p>
          <div className="flex items-center gap-x-2 mt-2 flex-row-reverse">
            <Input type="email" placeholder="name@example.com" className="text-right" />
            <Link href="/" className={buttonVariants()}>
              اشترك
            </Link>
          </div>
        </section>

        {footerNavigationData.map((nav) => (
          <nav key={nav.title}>
            <ul className="w-28 grid gap-2">
              <h3 className="font-semibold leading-none tracking-tight mb-1">
                {translateTitle(nav.title)}
              </h3>
              {nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "inline h-fit p-0 text-sm text-muted-foreground"
                  )}
                >
                  {translateLabel(link.label)}
                </Link>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t-[1px] border-sidebar-border">
        <div className="container flex justify-between items-center p-4 md:px-6 flex-row-reverse">
          <p className="text-xs text-muted-foreground md:text-sm">
            © {currentYear}{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
            >
              دراسي
            </a>
          </p>
          <p className="text-xs text-muted-foreground md:text-sm">
            تم تطويره وتشغيله بواسطة{" "}
            <a
              href="https://learnock.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
            >
              ليرنوك
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

// Optional translations
function translateTitle(title: string): string {
  switch (title) {
    case "Product":
      return "المنتج"
    case "Resources":
      return "الموارد"
    case "Legal":
      return "القانوني"
    case "Company":
      return "الشركة"
    default:
      return title
  }
}

function translateLabel(label: string): string {
  switch (label) {
    case "Benefits":
      return "الفوائد"
    case "Features":
      return "الميزات"
    case "Testimonials":
      return "آراء المستخدمين"
    case "Pricing":
      return "الأسعار"
    case "FAQs":
      return "الأسئلة الشائعة"
    case "Contact Us":
      return "تواصل معنا"
    case "Documentation":
      return "التوثيق"
    case "GitHub":
      return "جيت هاب"
    case "Changelog":
      return "سجل التغييرات"
    case "Support":
      return "الدعم"
    case "MIT License":
      return "رخصة MIT"
    case "Privacy Policy":
      return "سياسة الخصوصية"
    case "Terms of Service":
      return "شروط الخدمة"
    case "About":
      return "عن الشركة"
    case "Blog":
      return "المدونة"
    default:
      return label
  }
}
