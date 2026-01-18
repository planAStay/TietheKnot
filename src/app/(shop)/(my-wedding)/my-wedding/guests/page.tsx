import { Metadata } from 'next'
import GuestsClient from './guests-client'

export const metadata: Metadata = {
  title: 'Guest Management | My Wedding',
  description: 'Manage your wedding guest list with RSVP tracking, household grouping, and analytics',
}

export default function GuestsPage() {
  return <GuestsClient />
}


