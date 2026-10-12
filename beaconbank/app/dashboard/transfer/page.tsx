"use client"

import { ServiceForm } from "@/components/service-form"

export default function TransferPage() {
  return (
    <ServiceForm
      title="Send Money"
      description="Send funds from your account to another BeaconBank user."
      endpoint="/api/transfers/create"
      submitLabel="Send"
      successMessage="Transfer submitted."
      numberFields={["amount"]}
      fields={[
        { name: "recipientEmail", label: "Recipient email", type: "email", required: true },
        { name: "amount", label: "Amount", type: "number", required: true },
        { name: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "GBP"] },
        { name: "notes", label: "Note (optional)", type: "textarea" },
      ]}
    />
  )
}
