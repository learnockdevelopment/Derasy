import { CoreBenefitsList } from "./core-benefits-list"

export function CoreBenefits() {
  return (
    <section id="benefits" className="grid gap-10 bg-[#FFF8ED] rounded-xl px-6 py-16 shadow-sm border border-yellow-100">
      <div className="text-center mx-auto space-y-2 max-w-xl">
        <h2 className="text-4xl sm:text-5xl font-black text-[#2B2D42] tracking-tight font-display">
          ليه تختار منصتنا؟ 🎓✨
        </h2>
        <p className="text-base text-[#555] font-medium leading-relaxed">
          وفر وقتك وجهدك! مع منصتنا تقدر تستكشف المدارس، تقدم لأطفالك بسهولة،
          وتتابع حالة الطلب أول بأول — كل ده من موبايلك 💡📱
        </p>
      </div>
      <CoreBenefitsList />
    </section>
  )
}
