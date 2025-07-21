

import { Footer } from "../footer"
import { Sidebar } from "../sidebar"
import { HorizontalLayoutHeader } from "./horizontal-layout-header"

export function HorizontalLayout({
  children,
  dictionary,
}) {
  return (
    <>
      <Sidebar dictionary={dictionary} />
      <div className="w-full">
        <HorizontalLayoutHeader dictionary={dictionary} />
        <main className="min-h-[calc(100svh-9.85rem)] bg-muted/40">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

