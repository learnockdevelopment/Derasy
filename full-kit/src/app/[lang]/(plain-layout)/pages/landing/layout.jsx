import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "./_components/layout"
import { getCurrentUser } from "@/lib/getCurrentUser"

export default async function LandingLayout(props) {
  const params = await props.params

  const { children } = props

  const dictionary = await getDictionary(params.lang)
  const user = await getCurrentUser();
  const safeUser = user
    ? {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }
    : null;
  return <Layout dictionary={dictionary} user={safeUser}>{children}</Layout>
}
