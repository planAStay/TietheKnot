import { VendorReviewPageClient } from './vendor-review-client'

export default async function VendorReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <VendorReviewPageClient vendorId={id} />
}
