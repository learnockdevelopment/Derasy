
import { SettingsProvider } from "@/contexts/settings-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DirectionProvider } from "./direction-provider"
import { ModeProvider } from "./mode-provider"
import { NextAuthProvider } from "./next-auth-provider"
import { ThemeProvider } from "./theme-provider"
import UserProvider from "./user-provider"
export function Providers({
  session,
  locale,
  direction,
  children,
  user
}) {
  return (
    <UserProvider user={user}>
      <SettingsProvider locale={locale}>
        <ModeProvider>
          <ThemeProvider>
            <DirectionProvider direction={direction}>
              <NextAuthProvider session={session}>
                <SidebarProvider>{children}</SidebarProvider>
              </NextAuthProvider>
            </DirectionProvider>
          </ThemeProvider>
        </ModeProvider>
      </SettingsProvider>
    </UserProvider>
  )
}
