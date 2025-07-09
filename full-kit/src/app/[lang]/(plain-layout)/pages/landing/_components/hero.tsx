import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SocialProofBadgeAvatarsData } from "../_data/social-proof-badge-avatars"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AvatarStack } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrustedBy } from "./trusted-by"

export function Hero() {
  return (
    <section className="py-20 text-center bg-gradient-to-br from-[#FFFAE6] via-[#FFF0F0] to-[#E6F6FF] rounded-lg shadow-sm border border-yellow-100">
      <div className="grid place-items-center gap-y-6">
        <SocialProofBadge />
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-[#2B2D42] font-display tracking-tight">
          سهّل تقديم المدارس
        </h1>
        <p className="max-w-prose w-full text-lg text-muted-foreground text-[#444] font-medium">
          منصة ممتعة تساعدك في استكشاف المدارس، المقارنة، والتقديم بسهولة وراحة.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
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

    </section>
  )
}

function SocialProofBadge() {
  return (
    <div
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "group gap-x-1.5 rounded-full bg-white shadow border-pink-200 text-sm font-semibold text-pink-500"
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

function HeroImage() {
  return (
    <Card className="bg-white/60 backdrop-blur-sm p-4 md:p-8 rounded-xl border border-dashed border-yellow-300">
      <Card className="pointer-events-none p-0 overflow-hidden bg-transparent shadow-none" asChild>
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/images/misc/school-hero.png"
            alt="معاينة منصة التقديم للمدارس"
            fill
            sizes="(max-width: 768px) 640px, 1080px"
            priority
            className="object-cover object-top rounded-xl"
          />
        </AspectRatio>
      </Card>
    </Card>
  )
}
