import type { DictionaryType } from "@/lib/get-dictionary";

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout";

import { SignInForm } from "./sign-in-form";

export function SignIn({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth
      imgSrc="/images/school.jpg" // Replace with your branded image
      dictionary={dictionary}
    >
      <AuthHeader>
        <AuthTitle>تسجيل الدخول إلى دراسي</AuthTitle>
        <AuthDescription>
          أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى منصة دراسي لتقديم المدارس
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <SignInForm />
      </AuthForm>
    </Auth>
  );
}
