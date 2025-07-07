import type { CoreBenefitType } from "../types"

export const coreBenefitsData: CoreBenefitType[] = [
  {
    title: "One Platform for All Schools",
    description:
      "No more visiting multiple websites or filling out endless forms. Compare, choose, and apply to all schools from a single platform.",
    points: [
      "Browse public and private schools with filters for location, fees, and programs",
      "Side-by-side comparisons of school offerings and facilities",
      "Centralized application system for multiple schools",
    ],
    images: ["/images/illustrations/misc/schools-map.svg"],
  },
  {
    title: "Easy and Paperless Admissions",
    description:
      "Our platform digitizes the entire admission process — no paperwork, long queues, or repeated document submissions.",
    points: [
      "Upload and reuse documents securely across applications",
      "Auto-filled forms save time for parents",
      "Track application status in real time",
    ],
    images: ["/images/illustrations/scenes/scene-digital-forms.svg"],
  },
  {
    title: "Trusted by Parents and Schools Alike",
    description:
      "We build trust by keeping things transparent, secure, and parent-friendly. Schools also benefit from smoother, more efficient enrollments.",
    points: [
      "Secure data handling and compliance with local education regulations",
      "Real reviews and ratings from other parents",
      "Schools manage applications through a user-friendly dashboard",
    ],
    images: ["/images/illustrations/scenes/scene-trust.svg"],
  },
]
