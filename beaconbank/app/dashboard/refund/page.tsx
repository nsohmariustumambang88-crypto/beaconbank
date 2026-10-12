"use client"

import { ServiceForm } from "@/components/service-form"

export default function RefundPage() {
  return (
    <ServiceForm
      title="Request a Refund"
      description="Ask for a refund on a purchase or order."
      endpoint="/api/refunds/create"
      submitLabel="Submit request"
      successMessage="Refund request submitted."
      numberFields={["amount"]}
      fields={[
        { name: "originalOrderId", label: "Order or transaction ID", required: true },
        { name: "amount", label: "Amount", type: "number", required: true },
        { name: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "GBP"] },
        { name: "refundType", label: "Refund type", type: "select", options: ["full", "partial", "store_credit", "scheduled"] },
        { name: "reason", label: "Reason", type: "textarea", required: true },
      ]}
    />
  )
}
