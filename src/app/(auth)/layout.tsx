import { ApplicationLayout } from '@/app/(shop)/application-layout'
import { AuthLayout } from '@/components/auth-layout'
import { ConditionalAuthLayout } from '@/components/conditional-auth-layout'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicationLayout>
      <ConditionalAuthLayout>{children}</ConditionalAuthLayout>
    </ApplicationLayout>
  )
}
