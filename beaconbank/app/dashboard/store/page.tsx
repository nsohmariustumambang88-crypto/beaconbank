"use client"

import { ServiceForm } from "@/components/service-form"

export default function StorePage() {
  return (
    <ServiceForm
      title="Open Your Store"
      description="Create a storefront in the BeaconBank marketplace."
      endpoint="/api/marketplace/store/create"
      submitLabel="Create store"
      successMessage="Your store is ready."
      fields={[
        { name: "storeName", label: "Store name", required: true },
        { name: "description", label: "Description (optional)", type: "textarea" },
      ]}
    />
  )
}
