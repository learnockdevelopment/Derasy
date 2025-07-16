import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SocialProofBadgeAvatarsData } from "../_data/social-proof-badge-avatars"

import { cn } from "@/lib/utils"
import { AvatarStack } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { TrustedBy } from "./trusted-by"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-[#FFFAE6] via-[#FFF0F0] to-[#E6F6FF] rounded-lg shadow-sm border border-yellow-100">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="text-center md:text-start space-y-6">
          <SocialProofBadge />
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-[#2B2D42] font-display tracking-tight">
            سهّل تقديم المدارس
          </h1>
          <p className="text-lg text-[#444] font-medium max-w-prose mx-auto md:mx-0">
            منصة ممتعة تساعدك في استكشاف المدارس، المقارنة، والتقديم بسهولة وراحة.
          </p>

          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <Link
              href="/schools"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-base shadow-lg"
              )}
            >
              🎒 تصفّح المدارس
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-yellow-400 text-yellow-600 font-bold text-base shadow-sm bg-white hover:bg-yellow-50"
              )}
            >
              🧩 كيف تعمل المنصة؟
            </Link>
          </div>

          <TrustedBy />
        </div>

        {/* Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-xl overflow-hidden">
          <Image
            src="/images/download.png"
            alt="معاينة منصة التقديم للمدارس"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}

function SocialProofBadge() {
  return (
    <div
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "group gap-x-1.5 rounded-full bg-white shadow border-pink-200 text-sm font-semibold text-pink-500 inline-flex items-center"
      )}
    >
      <AvatarStack
        avatars={SocialProofBadgeAvatarsData}
        size="sm"
        className="me-1.5"
        avatarClassName="h-7 w-7"
      />
      موثوق من آلاف أولياء الأمور والمدارس
      <ArrowRight className="h-4 w-4 transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 rtl:scale-x-[-1] text-pink-400" />
    </div>
  )
}
