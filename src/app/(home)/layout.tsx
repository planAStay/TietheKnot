import { ApplicationLayout } from '@/app/(shop)/application-layout'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}

