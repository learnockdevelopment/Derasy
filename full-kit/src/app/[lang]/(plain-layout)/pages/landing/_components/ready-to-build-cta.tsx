import { FaSchool } from "react-icons/fa6"

import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ReadyToBuildCTA() {
  return (
    <section id="ready-to-build">
      <Card className="flex flex-col justify-center items-center gap-4 text-center px-6 py-12 bg-pink-50 border-pink-200 rounded-3xl shadow-sm">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-pink-600">ابدأ رحلتك المدرسية الآن 🎒</h2>
          <p className="max-w-prose mx-auto text-base text-gray-700">
            سهّل تقديم طفلك للمدرسة في خطوات بسيطة، وبدون أي أوراق. كل شيء في مكان واحد!
          </p>
        </div>
        <a
          href="/schools"
          className={buttonVariants({ size: "lg" })}
        >
          <FaSchool className="me-2 h-5 w-5 text-white" />
          تصفّح المدارس الآن
        </a>
      </Card>
    </section>
  )
}
