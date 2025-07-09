import { coreBenefitsData } from "../_data/core-benefits"

import { CoreBenefitsItem } from "./core-benefits-item"

export function CoreBenefitsList() {
  return (
    <ul className="space-y-8">
      {coreBenefitsData.map((benefit, idx) => (
        <CoreBenefitsItem key={benefit.title} benefit={benefit} index={idx}/>
      ))}
    </ul>
  )
}
