"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { LocaleType, NewPasswordFormType } from "@/types"
import { NewPasswordSchema } from "@/schemas/new-passward-schema"
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

export function NewPasswordForm() {
  const params = useParams()
  const searchParams = useSearchParams()

  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const email = searchParams.get("email") // ⬅️ we get email from query param
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty

  async function onSubmit(data: NewPasswordFormType) {
    if (!email) {
      toast({
        variant: "destructive",
        title: "❌ لا يوجد بريد إلكتروني",
        description: "تعذر العثور على البريد الإلكتروني لتحديث كلمة المرور.",
      })
      return
    }

    try {
      const res = await fetch("/api/register/reset-password/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: data.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "فشل تحديث كلمة المرور")
      }

      toast({
        title: "✅ تم تحديث كلمة المرور",
        description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
      })

      setTimeout(() => {
        window.location.href = ensureLocalizedPathname("/sign-in", locale)
      }, 1500)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "⚠️ حدث خطأ",
        description:
          error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء التحديث.",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 font-[Cairo] text-right"
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <Input type="password" dir="rtl" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تأكيد كلمة المرور</FormLabel>
                <FormControl>
                  <Input type="password" dir="rtl" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          تحديث كلمة المرور
        </ButtonLoading>

        <Link
          href={ensureLocalizedPathname(
            redirectPathname
              ? ensureRedirectPathname("/sign-in", redirectPathname)
              : "/sign-in",
            locale
          )}
          className="-mt-4 text-center text-sm underline text-blue-600"
        >
          العودة لتسجيل الدخول
        </Link>
      </form>
    </Form>
  )
}
