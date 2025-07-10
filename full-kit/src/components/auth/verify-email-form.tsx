"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function OtpVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "رمز التحقق غير صحيح")
      }

      toast({
        title: "✅ تم التحقق من البريد الإلكتروني",
        description: "يمكنك الآن تسجيل الدخول.",
      })

      router.push("/sign-in")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحقق",
        description: error instanceof Error ? error.message : "رمز غير صحيح أو منتهي",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    try {
      const res = await fetch("/api/register/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message)

      toast({ title: "📨 تم إرسال رمز جديد", description: "تحقق من بريدك الإلكتروني." })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر إعادة إرسال الرمز.",
      })
    } finally {
      setResending(false)
    }
  }

  return (
      <form onSubmit={handleVerifyOtp} className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">تأكيد البريد الإلكتروني</h1>
          <p className="text-muted-foreground text-sm">
            أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
          </p>
        </div>

        <Input
          type="text"
          dir="rtl"
          placeholder="أدخل الرمز"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <ButtonLoading
          isLoading={loading}
          disabled={!otp}
          className="w-full"
          type="submit"
        >
          تحقق
        </ButtonLoading>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="underline text-sm text-blue-600 w-full text-center"
        >
          {resending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
        </button>
      </form>
  )
}
