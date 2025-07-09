"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { LocaleType } from "@/types"
import { RegisterSchema } from "@/schemas/register-schema"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { ensureRedirectPathname } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SeparatorWithText } from "@/components/ui/separator"
import { OAuthLinks } from "./oauth-links"

type RegisterFormType = {
  name: string
  email: string
  password: string
  role: string
}

export function RegisterForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty

  async function onSubmit(data: RegisterFormType) {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result?.message || "Unknown error occurred")
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تحقق من بريدك الإلكتروني للحصول على رمز التحقق.",
      })

      router.push(
        ensureLocalizedPathname(
          redirectPathname
            ? ensureRedirectPathname("/sign-in", redirectPathname)
            : "/sign-in",
          locale
        )
      )
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التسجيل",
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input type="text" placeholder="أدخل اسمك الكامل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          تسجيل باستخدام البريد الإلكتروني
        </ButtonLoading>

        <div className="-mt-4 text-center text-sm">
          لديك حساب؟{" "}
          <Link
            href={ensureLocalizedPathname(
              redirectPathname
                ? ensureRedirectPathname("/sign-in", redirectPathname)
                : "/sign-in",
              locale
            )}
            className="underline"
          >
            تسجيل الدخول
          </Link>
        </div>

        <SeparatorWithText>أو تابع باستخدام</SeparatorWithText>
        <OAuthLinks />
      </form>
    </Form>
  )
}
