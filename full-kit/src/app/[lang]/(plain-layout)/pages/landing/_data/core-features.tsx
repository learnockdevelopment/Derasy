import Image from "next/image"
import {
  Globe,
  Languages,
  MailCheck,
  MonitorSmartphone,
  PencilRuler,
  SunMoon,
  FileCheck2,
  ListChecks,
} from "lucide-react"

import type { CoreFeatureType } from "../types"

import { BentoHeader } from "@/components/ui/bento-grid"
import { Card } from "@/components/ui/card"
import { Iphone15Pro } from "@/components/ui/iphone-15-pro"

export const coreFeaturesData: CoreFeatureType[] = [
  {
    title: "Track Applications in Real Time",
    description:
      "Know the status of every application instantly — no more waiting in the dark. Get notified on every change.",
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
    title: "Mobile-Friendly Experience",
    description:
      "Parents can explore schools, submit applications, and track progress — all from their phone.",
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
    title: "Paperless & Hassle-Free",
    description:
      "Upload documents once and use them for all applications. No printing, scanning, or long queues.",
    icon: FileCheck2,
    className: "",
  },
  {
    title: "Personalized School Matches",
    description:
      "Filter schools by fees, location, language, and special programs. Find what fits your child best.",
    icon: ListChecks,
    className: "",
  },
  {
    title: "Multilingual & RTL Support",
    description:
      "Parents can use the platform in their preferred language. Arabic, English, French, and more supported.",
    icon: Languages,
  },
  {
    title: "Trusted & Secure Platform",
    description:
      "We use modern encryption and privacy protocols to keep your personal data and documents safe.",
    icon: Globe,
  },
]
