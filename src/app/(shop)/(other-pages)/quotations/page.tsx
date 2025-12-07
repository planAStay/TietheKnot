'use client'

import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import { useWedding } from '@/lib/wedding-context'

const statusColor: Record<string, string> = {
  requested: 'text-[#E4BC62] bg-[#E4BC62]/10',
  pending: 'text-[#E4BC62] bg-[#E4BC62]/10',
  responded: 'text-emerald-700 bg-emerald-50',
  booked: 'text-emerald-700 bg-emerald-50',
  declined: 'text-[#DFB3AE] bg-[#DFB3AE]/10',
}

export default function QuotationsPage() {
  const { quotations } = useWedding()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-semibold text-[#23292E]">
          Quotations
        </Heading>
        <TextLink href="/collections/all" className="text-sm font-semibold text-[#E4BC62]">
          Find more vendors
        </TextLink>
      </div>
      <Text className="mt-1 text-sm text-zinc-600">
        Track every request you send. Update status as vendors reply.
      </Text>

      {quotations.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-[#DDDED9]/60 bg-white p-6 text-center">
          <Text className="text-sm text-zinc-600">No requests yet. Ask for quotes from vendor pages.</Text>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {quotations.map((q) => (
            <div key={q.id} className="rounded-lg border border-[#DDDED9]/40 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Text className="text-sm font-semibold text-[#23292E]">{q.vendorName}</Text>
                  <Text className="text-xs text-zinc-500 capitalize">
                    {q.category} • {q.subcategory}
                  </Text>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[q.status]}`}>
                  {q.status}
                </span>
              </div>
              <div className="mt-2 grid gap-3 text-sm text-zinc-600 md:grid-cols-3">
                {q.budget ? <p>Budget: {q.budget}</p> : null}
                {q.guestCount ? <p>Guests: {q.guestCount}</p> : null}
                {q.eventDate ? <p>Event date: {q.eventDate}</p> : null}
              </div>
              {q.notes ? <p className="mt-2 text-sm text-zinc-600">Notes: {q.notes}</p> : null}
              <Text className="mt-1 text-xs text-zinc-400">Sent {new Date(q.createdAt).toLocaleDateString()}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

