import { ApplicationLayout } from '@/app/(shop)/application-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Hide header and footer for get-started page
  return (
    <ApplicationLayout header={null} footer={null}>
      {children}
    </ApplicationLayout>
  )
}

