import { WhatPeopleSayCarousel } from "./what-people-say-carousel"

export function WhatPeopleSay() {
  return (
    <section
      id="testimonials"
      className="flex flex-col gap-10 bg-yellow-50 p-6 border border-yellow-200 shadow-sm"
    >
      <div className="text-center mx-auto space-y-2">
        <h2 className="text-4xl font-extrabold text-pink-600">آراء أولياء الأمور</h2>
        <p className="max-w-prose text-base text-gray-600 leading-relaxed">
          اكتشف لماذا يثق أولياء الأمور في منصتنا لتسهيل عملية التقديم للمدارس — من سهولة التصفح إلى تتبع حالة الطلب.
        </p>
      </div>
      <WhatPeopleSayCarousel />
    </section>
  )
}
