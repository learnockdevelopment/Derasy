import Swal from "sweetalert2"
import { OAuthButtons } from "../../../../../../../../../components/auth/oauth2"

export const showLoading = (
  title = "جاري الإرسال",
  html = "جاري معالجة طلبك..."
) => {
  return Swal.fire({
    title,
    html,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  })
}

export const showError = (title = "خطأ", text = "حدث خطأ غير متوقع") => {
  return Swal.fire({ icon: "error", title, text })
}

export const showSuccess = (title = "تم بنجاح", text = "") => {
  return Swal.fire({ icon: "success", title, text })
}

export const showWarning = (title = "تنبيه", text = "") => {
  return Swal.fire({ icon: "warning", title, text })
}

export const promptEmail = () => {
  return Swal.fire({
    icon: "warning",
    title: "تنبيه",
    text: "يرجى إدخال بريدك الإلكتروني لإرسال طلب بطاقة الطالب.",
    input: "email",
    inputPlaceholder: "example@example.com",
    confirmButtonText: "إرسال",
    showCancelButton: true,
    cancelButtonText: "إلغاء",
    preConfirm: (email) => {
      if (!email) {
        Swal.showValidationMessage("البريد الإلكتروني مطلوب")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.showValidationMessage("صيغة البريد الإلكتروني غير صحيحة")
      }
      return email
    },
  })
}

export const promptOtp = (email, attempts, maxAttempts) => {
  return Swal.fire({
    title: "التحقق من البريد الإلكتروني",
    html: `
      <div style="text-align: right; direction: rtl;">
          <p style="margin-bottom: 15px;">تم إرسال رمز التحقق إلى <strong>${email}</strong></p>
          <p style="margin-bottom: 20px; color: #666;">الرجاء إدخال الرمز المكون من 6 أرقام</p>
          <input type="text" 
                 id="otp" 
                 class="swal2-input" 
                 placeholder="------" 
                 maxlength="6" 
                 style="text-align: center; 
                        letter-spacing: 10px;
                        font-size: 24px;
                        padding: 10px;
                        width: 80%;
                        margin: 0 auto;">
          ${attempts > 1 ? `<p style="color: #e74c3c; margin-top: 10px;">رمز التحقق غير صحيح. لديك ${maxAttempts - attempts + 1} محاولات متبقية</p>` : ""}
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: "إلغاء",
    confirmButtonText: "تحقق",
    allowOutsideClick: false,
    preConfirm: () => {
      const otpInput = Swal.getPopup().querySelector("#otp")
      if (!otpInput.value || otpInput.value.length !== 6) {
        Swal.showValidationMessage("الرجاء إدخال رمز التحقق المكون من 6 أرقام")
        return false
      }
      return otpInput.value
    },
    didOpen: () => {
      const otpInput = Swal.getPopup().querySelector("#otp")
      otpInput.focus()
    },
  })
}
