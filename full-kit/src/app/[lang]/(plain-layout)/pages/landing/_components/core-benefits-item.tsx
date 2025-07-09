import Image from "next/image"
import { Check } from "lucide-react"
import type { CoreBenefitType } from "../types"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import {
  StickyLayout,
  StickyLayoutContent,
  StickyLayoutPane,
} from "@/components/ui/sticky-layout"

export function CoreBenefitsItem({ benefit, index }: { benefit: CoreBenefitType, index: number }) {
  const isEven = index % 2 === 0

  return (
    <Card
      asChild
      className={`container p-6 bg-transparent border-none ${
        isEven ? "lg:[direction:rtl]" : "lg:[direction:ltr]"
      }`}
    >
      <StickyLayout asChild>
        <li className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <StickyLayoutPane>
            <h3 className="text-3xl font-extrabold text-[#FF6B6B] mb-3 tracking-tight">
              {benefit.title}
            </h3>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              {benefit.description}
            </p>
            <ul className="space-y-4">
              {benefit.points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 bg-pink-100 rounded-xl p-4 shadow-sm"
                >
                  <div className="bg-white rounded-full p-2 shadow text-pink-500">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-gray-800 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </StickyLayoutPane>

          {/* Image Side */}
          <StickyLayoutContent>
            {benefit.images.map((image) => (
              <div
                key={image}
                className="rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-200"
              >
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={image}
                    alt="ميزة"
                    fill
                    className="object-cover bg-white"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </AspectRatio>
              </div>
            ))}
          </StickyLayoutContent>
        </li>
      </StickyLayout>
    </Card>
  )
}
