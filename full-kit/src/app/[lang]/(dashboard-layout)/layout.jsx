
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "@/components/layout"

export default async function DashboardLayout(props) {
  const params = await props.params

  const { children } = props
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
  const dictionary = await getDictionary(params.lang)

  return <Layout user={safeUser} dictionary={dictionary}>{children}</Layout>
}

