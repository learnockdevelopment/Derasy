import { Cairo, Lato } from "next/font/google"
import { getServerSession } from "next-auth"

import { i18n } from "@/configs/i18n"
import { authOptions } from "@/configs/next-auth"
import { cn } from "@/lib/utils"

import "../globals.css"
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Providers } from "@/providers"

import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { AssistantChat } from './chat'

// Metadata must be in a separate file if you're using JSX,
// but keeping it here if you're using this with experimental features.
export const metadata = {
  title: {
    template: "%s | Derasy",
    default: "Derasy",
  },
  description: "",
  metadataBase: new URL(process.env.BASE_URL),
}

const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default async function RootLayout(props) {
  const params = await props.params
  const { children } = props

  const session = await getServerSession(authOptions)
  const direction = i18n.localeDirection[params.lang]
  const user = await getCurrentUser();

  return (
    <html lang={params.lang} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-lato [&:lang(ar)]:font-cairo",
          "bg-background text-foreground antialiased overscroll-none",
          latoFont.variable,
          cairoFont.variable
        )}
      >
        <Providers locale={params.lang} direction={direction} session={session}>
          {children}
          {user && <AssistantChat avatar={user?.avatar ?? ""} token={user?.token ?? ""} />}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
