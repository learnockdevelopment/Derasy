"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { LocaleType, SignInFormType } from "@/types";

import { SignInSchema } from "@/schemas/sign-in-schema";
import { toast } from "@/hooks/use-toast";

import { ButtonLoading } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params.lang as LocaleType;

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { isSubmitting } = form.formState;
  const isDisabled = isSubmitting;

  async function login({ email, password }: SignInFormType) {
    try {
      toast({
        title: "جاري تسجيل الدخول...",
        description: "نقوم بمعالجة بياناتك.",
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      toast({
        title: "📡 تم إرسال الطلب",
        description: "ننتظر رد الخادم...",
      });

      const result = await res.json();

      if (!res.ok || !result.token) {
        toast({
          variant: "destructive",
          title: "❌ فشل تسجيل الدخول",
          description: result.message || "حدث خطأ في المصادقة",
        });
        return;
      }

      toast({
        title: "✅ تسجيل الدخول ناجح",
        description: "جاري تحويلك إلى لوحة التحكم...",
      });

      document.cookie = `token=${result.token}; path=/;`;
      router.push(result.redirectUrl);
    } catch (error) {
      console.error("🚨 Error during login:", error);
      toast({
        variant: "destructive",
        title: "⚠️ خطأ في الاتصال",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      });
    }
  }

  async function onSubmit(data: SignInFormType) {
    await login(data);
  }

  const testUsers = [
    { label: "👤 ولي أمر", email: "parent@derasy.com", password: "123456" },
    { label: "🏫 صاحب مدرسة", email: "school@derasy.com", password: "123456" },
    { label: "🛠️ مشرف", email: "moderator@derasy.com", password: "123456" },
    { label: "🧑‍💼 مدير", email: "admin@derasy.com", password: "123456" }
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 text-right font-[Cairo]"
      >
        <div className="grid grow gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input
                    dir="rtl"
                    type="email"
                    placeholder="example@derasy.com"
                    {...field}
                  />
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
                <div className="flex justify-between items-center">
                  <FormLabel>كلمة المرور</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm underline text-blue-600"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <FormControl>
                  <Input
                    dir="rtl"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          تسجيل الدخول
        </ButtonLoading>

        <div className="text-center text-sm mt-2">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="underline text-blue-600">
            إنشاء حساب جديد
          </Link>
        </div>

        {/* 🔽 Quick Login Buttons */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm border">
          <h4 className="text-center font-semibold mb-2 text-gray-600">
            تسجيل دخول سريع للمستخدمين التجريبين
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {testUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded transition text-center"
                onClick={() => login({ email: user.email, password: user.password })}
              >
                {user.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
}
