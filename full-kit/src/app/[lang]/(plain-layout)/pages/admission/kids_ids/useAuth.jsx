import Swal from "sweetalert2";

export default function useAuth() {
  const showLoginPopup = (onSuccess) => {
    Swal.fire({
      title: "تسجيل الدخول",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="البريد الإلكتروني" type="email" />
        <input id="swal-input2" class="swal2-input" placeholder="كلمة المرور" type="password" />
      `,
      confirmButtonText: "تسجيل الدخول",
      focusConfirm: false,
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#swal-input1").value;
        const password = Swal.getPopup().querySelector("#swal-input2").value;
        if (!email || !password) {
          Swal.showValidationMessage(`الرجاء إدخال البريد الإلكتروني وكلمة المرور`);
        }
        return { email, password };
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.value),
        });

        const data = await res.json();

        if (!res.ok) {
          await Swal.fire({
            icon: "error",
            title: "فشل تسجيل الدخول",
            text: data.message || "حدث خطأ أثناء تسجيل الدخول.",
          });
          showLoginPopup(onSuccess); // Retry login
        } else {
          document.cookie = `token=${data.token}; path=/; max-age=86400; secure`;
          await Swal.fire({
            icon: "success",
            title: "تم تسجيل الدخول",
            text: "تم تسجيل الدخول بنجاح",
          });
          if (onSuccess) onSuccess(data.token);
        }
      } catch {
        await Swal.fire({
          icon: "error",
          title: "خطأ في الاتصال",
          text: "فشل الاتصال بالخادم.",
        });
        showLoginPopup(onSuccess); // Retry login
      }
    });
  };

  return { showLoginPopup };
}
