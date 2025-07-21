import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "./_components/layout"
import { getCurrentUser } from "@/lib/getCurrentUser"

export default async function LandingLayout(props) {
  const params = await props.params

  const { children } = props

  const dictionary = await getDictionary(params.lang)
  const user = await getCurrentUser();
  const safeUser = {
    id: user._id?.toString?.() || '',
    fullName: user.name || '',
    email: user.email || '',
    role: user.role || '',
    wallet: user.wallet || 0,
    emailVerified: user.emailVerified || false,
    createdAt: user.createdAt?.toString?.() || '',
    updatedAt: user.updatedAt?.toString?.() || '',
    token: user.token || '',
    ownedSchools: (user.ownedSchools || []).map((school) => ({
      id: school._id?.toString?.() || '',
      name: school.name || '',
      ownership: {
        owner: {
          id: school.ownership?.owner?._id?.toString?.() || '',
          fullName: school.ownership?.owner?.fullName || '',
          email: school.ownership?.owner?.email || '',
        },
        moderators: (school.ownership?.moderators || []).map((mod) => ({
          id: mod._id?.toString?.() || '',
          fullName: mod.fullName || '',
          email: mod.email || '',
        })),
      },
    })),
  };

  return <Layout dictionary={dictionary} user={safeUser}>{children}</Layout>
}
