import Swal from "sweetalert2";

export default function useAuth() {
  const showLoginPopup = () => {
    return new Promise((resolve) => {
      Swal.fire({
        title: "تسجيل الدخول",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="البريد الإلكتروني" type="email" aria-label="البريد الإلكتروني" />
          <input id="swal-input2" class="swal2-input" placeholder="كلمة المرور" type="password" aria-label="كلمة المرور" />
        `,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: "تسجيل الدخول",
        preConfirm: () => {
          const email = Swal.getPopup().querySelector("#swal-input1").value;
          const password = Swal.getPopup().querySelector("#swal-input2").value;
          if (!email || !password) {
            Swal.showValidationMessage(`الرجاء إدخال البريد الإلكتروني وكلمة المرور`);
          }
          return { email, password };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
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
                confirmButtonText: "حاول مرة أخرى",
              });
              resolve(null); // login failed
              return;
            }

            // Set cookie and notify success
            document.cookie = `token=${data.token}; path=/; max-age=86400; secure`;

            await Swal.fire({
              icon: "success",
              title: "تم تسجيل الدخول",
              text: "تم تسجيل الدخول بنجاح",
              confirmButtonText: "حسناً",
            });

            resolve(data.token); // ✅ return the token
          } catch (error) {
            await Swal.fire({
              icon: "error",
              title: "خطأ في الاتصال",
              text: "فشل الاتصال بالخادم.",
              confirmButtonText: "حسنًا",
            });
            resolve(null); // network error
          }
        } else {
          resolve(null); // modal was dismissed
        }
      });
    });
  };

  return { showLoginPopup };
}
