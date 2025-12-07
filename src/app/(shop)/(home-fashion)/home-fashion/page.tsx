import { Metadata } from 'next'
import ClientDashboard from './home-dashboard-client'

export const metadata: Metadata = {
  title: 'TieTheKnot Dashboard',
  description: 'Plan your wedding with favorites, quotes, and a live countdown.',
}

export default function Home() {
  return <ClientDashboard />
}
