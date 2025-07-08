"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"

import type { ForgotPasswordFormType, LocaleType } from "@/types"

import { ForgotPasswordSchema } from "@/schemas/forgot-passward-schema"

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

export function ForgotPasswordForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")

  const [showOtpInput, setShowOtpInput] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty

  async function handleSendOtp(data: ForgotPasswordFormType) {
    try {
      const res = await fetch("/api/register/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "فشل إرسال رمز التحقق")
      }

      toast({
        title: "📧 تم إرسال الرمز",
        description: "تحقق من بريدك الإلكتروني للحصول على رمز التحقق.",
      })

      setEmail(data.email)
      setShowOtpInput(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ حدث خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      })
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsVerifying(true)
      const res = await fetch("/api/register/reset-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "رمز التحقق غير صحيح")
      }

      toast({
        title: "✅ تم التحقق من الرمز",
        description: "يمكنك الآن تعيين كلمة مرور جديدة.",
      })

      // Redirect to reset-password page with email
      window.location.href = `/new-password?email=${encodeURIComponent(email)}`
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ فشل التحقق",
        description: error instanceof Error ? error.message : "رمز غير صحيح أو منتهي",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSendOtp)} className="grid gap-6 font-[Cairo] text-right">
        {!showOtpInput && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
              إرسال الرمز
            </ButtonLoading>
          </>
        )}

        {showOtpInput && (
          <>
            <div>
              <FormLabel>أدخل رمز التحقق</FormLabel>
              <Input
                type="text"
                inputMode="numeric"
                dir="rtl"
                placeholder="أدخل الرمز المرسل"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <ButtonLoading
              type="button"
              isLoading={isVerifying}
              onClick={handleVerifyOtp}
              disabled={!otp || isVerifying}
            >
              تحقق من الرمز
            </ButtonLoading>
          </>
        )}

        {!showOtpInput && (
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
        )}
      </form>
    </Form>
  )
}
