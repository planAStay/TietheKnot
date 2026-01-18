import { ApplicationLayout } from '@/app/(shop)/application-layout'
import { AuthLayout } from '@/components/auth-layout'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicationLayout>
      <AuthLayout>{children}</AuthLayout>
    </ApplicationLayout>
  )
}
