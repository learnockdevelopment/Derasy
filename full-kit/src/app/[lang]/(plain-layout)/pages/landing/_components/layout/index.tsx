import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { LandingFooter } from "./landing-footer"
import { LandingHeader } from "./landing-header"
export function Layout({
  children,
  dictionary,
  user
}: {
  children: ReactNode
  dictionary: DictionaryType,
  user?: { name?: string; email?: string; avatar?: string }
}) {
  return (
    <div className="grow">
      <LandingHeader dictionary={dictionary} user={user} />
      <main>{children}</main>
      <LandingFooter />
    </div>
  )
}
