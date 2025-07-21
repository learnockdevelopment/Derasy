"use client"
import { useIsVertical } from "@/hooks/use-is-vertical"
import { Customizer } from "./customizer"
import { HorizontalLayout } from "./horizontal-layout"
import { VerticalLayout } from "./vertical-layout"

export function Layout({
  children,
  dictionary,
  user
}) {
  const isVertical = useIsVertical()

  return (
    <>
      <Customizer />
      {/* If the layout is vertical, render a vertical layout; otherwise, render a horizontal layout */}
      {isVertical ? (
        <VerticalLayout user={user} dictionary={dictionary}>{children}</VerticalLayout>
      ) : (
        <HorizontalLayout user={user} dictionary={dictionary}>{children}</HorizontalLayout>
      )}
    </>
  )
}
