"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { OAuthButtons } from "./oauth2"
import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { ComponentProps } from "react"
import { RocketIcon } from "lucide-react"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LanguageDropdown } from "../language-dropdown"

interface AuthProps extends ComponentProps<"div"> {
  imgSrc?: string
  imgClassName?: string
  dictionary: DictionaryType
}

export function Auth({
  className,
  children,
  imgSrc,
  imgClassName,
  dictionary,
  ...props
}: AuthProps) {
  const params = useParams()
  const locale = params.lang as LocaleType

  return (
    <section
      className={cn(
        "min-h-screen w-full flex justify-between px-0",
        className
      )}
      {...props}
    >
      <div className="flex-1 relative grid">
        <div className="absolute top-0 inset-x-0 flex justify-between items-center px-4 py-2.5">
          <Link
            href={ensureLocalizedPathname("/", locale)}
            className="flex text-foreground font-black z-50"
          >
            <span>Derasy</span>
          </Link>
          <LanguageDropdown dictionary={dictionary} />
        </div>
        
        <div className="max-w-[28rem] w-full m-auto px-6 py-12 space-y-8">
          {/* Development Status Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <RocketIcon className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-2 text-right">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  جاري التطوير حاليًا
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  النظام في مرحلة التطوير النشط. يمكنك متابعة آخر التحديثات والتغييرات من خلال صفحة التحديثات.
                </p>
                <Button 
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  <Link href={ensureLocalizedPathname("/pages/updates", locale)}>
                    عرض التحديثات
                    <RocketIcon className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {children}
          <OAuthButtons callbackUrl={'/sign-in'}/>
        </div>
      </div>

      {imgSrc && <AuthImage imgSrc={imgSrc} className={cn("", imgClassName)} />}
    </section>
  )
}

interface AuthImageProps extends ComponentProps<"div"> {
  imgSrc: string
}

export function AuthImage({ className, imgSrc, ...props }: AuthImageProps) {
  return (
    <div
      className={cn(
        "basis-1/2 relative hidden min-h-screen bg-muted md:block",
        className
      )}
      {...props}
    >
      <Image
        src={imgSrc}
        alt="Image"
        fill
        sizes="(max-width: 1200px) 60vw, 38vw"
        priority
        className="object-cover"
      />
    </div>
  )
}

export function AuthHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-2 text-center", className)} {...props} />
}

export function AuthTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function AuthDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

export function AuthForm({ className, ...props }: ComponentProps<"div">) {
  return <div className={className} {...props} />
}

export function AuthFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid gap-6", className)} {...props} />
}