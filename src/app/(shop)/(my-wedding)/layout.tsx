import { ApplicationLayout } from '@/app/(shop)/application-layout'

export default function MyWeddingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}
