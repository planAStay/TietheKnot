import { Metadata } from 'next'
import DashboardClient from './dashboard-client'

export const metadata: Metadata = {
  title: 'My Wedding Dashboard | TieTheKnot',
  description: 'Your wedding planning dashboard - manage shortlist, quotes, checklist, and countdown to your big day.',
}

export default function MyWeddingPage() {
  return <DashboardClient />
}

