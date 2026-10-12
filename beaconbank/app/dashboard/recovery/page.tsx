"use client"

import { ServiceForm } from "@/components/service-form"

export default function RecoveryPage() {
  return (
    <ServiceForm
      title="Open a Recovery Case"
      description="Report a disputed or fraudulent transaction so our team can investigate."
      endpoint="/api/recovery/create"
      submitLabel="Open case"
      successMessage="Recovery case opened. Our team will review it."
      numberFields={["amount"]}
      fields={[
        { name: "fraudType", label: "Type of issue", type: "select", options: ["unauthorized_transaction", "phishing", "identity_theft", "other"] },
        { name: "amount", label: "Amount involved", type: "number", required: true },
        { name: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "GBP"] },
        { name: "description", label: "What happened", type: "textarea", required: true },
      ]}
    />
  )
}
