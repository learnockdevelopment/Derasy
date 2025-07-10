import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { OtpVerifyPage } from "./verify-email-form"

export function VerifyEmail({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth dictionary={dictionary}>
      <AuthForm>
        <OtpVerifyPage />
      </AuthForm>
    </Auth>
  )
}
