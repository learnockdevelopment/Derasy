import { AllUsersTable } from "./_components/all-users"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata = {
  title: "CRM",
}

export default function CRMPage() {
  return (
    <section className="container grid gap-4 p-4 md:grid-cols-1">
      <AllUsersTable />
    </section>
  )
}
