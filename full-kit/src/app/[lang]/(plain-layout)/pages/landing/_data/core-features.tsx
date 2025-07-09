import Image from "next/image"
import {
  Globe,
  Languages,
  MailCheck,
  MonitorSmartphone,
  FileCheck2,
  ListChecks,
} from "lucide-react"

import type { CoreFeatureType } from "../types"

import { BentoHeader } from "@/components/ui/bento-grid"
import { Card } from "@/components/ui/card"
import { Iphone15Pro } from "@/components/ui/iphone-15-pro"

export const coreFeaturesData: CoreFeatureType[] = [
  {
    title: "تتبع حالة الطلبات لحظياً",
    description:
      "اعرف حالة كل طلب فوراً — لا حاجة للانتظار. يصلك إشعار عند حدوث أي تحديث.",
    icon: MailCheck,
    className: "md:[&>div]:first:basis-1/3 md:col-span-2 md:flex-row",
    header: (
      <BentoHeader className="hidden md:block">
        <Card>
          <Image
            src="/images/illustrations/misc/notifications.svg"
            alt=""
            height={1080}
            width={1080}
            className="h-56 w-full object-cover bg-white overflow-hidden dark:invert"
          />
        </Card>
      </BentoHeader>
    ),
  },
  {
    title: "تجربة سهلة عبر الجوال",
    description:
      "يمكن لولي الأمر تصفّح المدارس وتقديم الطلبات وتتبع التقدم من خلال الهاتف بكل سهولة.",
    icon: MonitorSmartphone,
    className: "md:row-span-3 md:pb-0",
    header: (
      <BentoHeader className="hidden max-h-114 overflow-hidden md:block">
        <Iphone15Pro
          imageSrc="/images/misc/mobile.jpg"
          className="h-auto w-full dark:hidden"
          id="iphone-15-pro-1"
        />
        <Iphone15Pro
          imageSrc="/images/misc/mobile-dark.jpg"
          className="hidden h-auto w-full dark:md:block"
          id="iphone-15-pro-2"
        />
      </BentoHeader>
    ),
  },
  {
    title: "بدون أوراق أو تعقيد",
    description:
      "ارفع مستنداتك مرة واحدة فقط واستخدمها في جميع الطلبات. لا طباعة ولا مسح ضوئي.",
    icon: FileCheck2,
    className: "",
  },
  {
    title: "نتائج مدارس مخصصة لطفلك",
    description:
      "فلتر المدارس حسب الرسوم، الموقع، اللغة، والبرامج المميزة. اختر الأنسب لطفلك.",
    icon: ListChecks,
    className: "",
  },
  {
    title: "دعم متعدد اللغات والاتجاه من اليمين",
    description:
      "المنصة تدعم العربية، الإنجليزية، الفرنسية، وغيرها. اختر اللغة التي تناسبك.",
    icon: Languages,
  },
  {
    title: "منصة موثوقة وآمنة",
    description:
      "نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية ومستنداتك.",
    icon: Globe,
  },
]
