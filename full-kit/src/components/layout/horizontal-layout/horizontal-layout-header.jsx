"use client"

import { Separator } from "@/components/ui/separator"
import { BottomBarHeader } from "./bottom-bar-header"
import { TopBarHeader } from "./top-bar-header"

export function HorizontalLayoutHeader({
  dictionary,
  user
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-sidebar-border">
      <TopBarHeader dictionary={dictionary} />
      <Separator className="hidden bg-sidebar-border h-[0.5px] md:block" />
      <BottomBarHeader dictionary={dictionary} user={user}/>
    </header>
  )
}
