

import { Footer } from "../footer"
import { Sidebar } from "../sidebar"
import { HorizontalLayoutHeader } from "./horizontal-layout-header"

export async function HorizontalLayout({
  children,
  dictionary,
  user
}) {
    
  return (
    <>
      <Sidebar dictionary={dictionary} />
      <div className="w-full">
        <HorizontalLayoutHeader dictionary={dictionary} user={user} />
        <main className="min-h-[calc(100svh-9.85rem)] bg-muted/40">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

