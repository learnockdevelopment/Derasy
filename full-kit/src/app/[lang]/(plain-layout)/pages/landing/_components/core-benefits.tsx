import { CoreBenefitsList } from "./core-benefits-list"

export function CoreBenefits() {
  return (
    <section id="benefits" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-4xl font-semibold">Why Choose Our Platform?</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          We simplify the school admission journey—explore schools in one place,
          apply online effortlessly, and stay updated with real-time application tracking.
        </p>
      </div>
      <CoreBenefitsList />
    </section>
  )
}
