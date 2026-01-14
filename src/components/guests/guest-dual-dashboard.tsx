'use client'

import { TGuest, TGuestHousehold, TGuestSide, TRsvpStatus } from '@/type'
import { incrementGuestCount, decrementGuestCount } from '@/lib/guest-manager'
import clsx from 'clsx'
import { useState } from 'react'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

interface Props {
  guests: TGuest[]
  households: TGuestHousehold[]
  onEditGuest: (guest: TGuest) => void
  onDeleteGuest: (guestId: string) => void
  onUpdateGuest: (guestId: string, updates: Partial<Omit<TGuest, 'id' | 'createdAt'>>) => void
  refreshGuests: () => void
}

export default function GuestDualDashboard({
  guests,
  households,
  onEditGuest,
  onDeleteGuest,
  onUpdateGuest,
  refreshGuests,
}: Props) {
  const [expandedGuests, setExpandedGuests] = useState<Set<string>>(new Set())
  const [mobileActiveSide, setMobileActiveSide] = useState<'bride' | 'groom' | 'mutual'>('bride')

  const toggleExpanded = (guestId: string) => {
    const next = new Set(expandedGuests)
    if (next.has(guestId)) {
      next.delete(guestId)
    } else {
      next.add(guestId)
    }
    setExpandedGuests(next)
  }

  const handleIncrementCount = (guestId: string) => {
    incrementGuestCount(guestId)
    refreshGuests()
  }

  const handleDecrementCount = (guestId: string) => {
    decrementGuestCount(guestId)
    refreshGuests()
  }

  const handleStatusChange = (guestId: string, status: TRsvpStatus) => {
    onUpdateGuest(guestId, {
      rsvpStatus: status,
      respondedAt: status === 'attending' || status === 'declined' ? new Date().toISOString() : undefined,
    })
    refreshGuests()
  }

  const getGuestsBySide = (side: TGuestSide) => guests.filter((g) => g.side === side)

  const brideGuests = getGuestsBySide('bride')
  const groomGuests = getGuestsBySide('groom')
  const mutualGuests = getGuestsBySide('mutual')

  const renderGuestCard = (guest: TGuest) => {
    const household = guest.householdId ? households.find((h) => h.id === guest.householdId) : null
    const isExpanded = expandedGuests.has(guest.id)

    const statusColors: Record<TRsvpStatus, string> = {
      draft: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      invited: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      attending: 'bg-green-500/10 text-green-600 dark:text-green-400',
      declined: 'bg-red-500/10 text-red-600 dark:text-red-400',
      'no-response': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    }

    return (
      <div
        key={guest.id}
        className="group rounded-lg border border-primary/10 bg-surface p-4 transition hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text truncate">{guest.name}</h3>
              {(guest.guestCount || 1) > 1 && (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {guest.guestCount || 1} people
                </span>
              )}
              {guest.priorityTier === 'tier1' && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Tier 1
                </span>
              )}
              {household && (
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                  {household.name}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                  statusColors[guest.rsvpStatus]
                )}
              >
                {guest.rsvpStatus.replace('-', ' ')}
              </span>
              {guest.relationshipLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guest.relationshipLabels.slice(0, 2).map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-primary/5 px-2 py-0.5 text-xs text-text/70"
                    >
                      {label}
                    </span>
                  ))}
                  {guest.relationshipLabels.length > 2 && (
                    <span className="rounded-full bg-primary/5 px-2 py-0.5 text-xs text-text/70">
                      +{guest.relationshipLabels.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleExpanded(guest.id)}
              className="rounded-lg p-2 text-text/40 hover:bg-primary/10 hover:text-primary transition"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            <button
              onClick={() => onEditGuest(guest)}
              className="rounded-lg p-2 text-text/40 hover:bg-primary/10 hover:text-primary transition"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteGuest(guest.id)}
              className="rounded-lg p-2 text-text/40 hover:bg-red-500/10 hover:text-red-500 transition"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-3 border-t border-primary/10 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guest.email && (
                <div className="flex items-center gap-2 text-sm text-text/70">
                  <EnvelopeIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{guest.email}</span>
                </div>
              )}
              {guest.phone && (
                <div className="flex items-center gap-2 text-sm text-text/70">
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  <span>{guest.phone}</span>
                </div>
              )}
              {guest.invitedAt && (
                <div className="flex items-center gap-2 text-sm text-text/70">
                  <CalendarDaysIcon className="h-4 w-4 shrink-0" />
                  <span>Invited: {new Date(guest.invitedAt).toLocaleDateString()}</span>
                </div>
              )}
              {guest.respondedAt && (
                <div className="flex items-center gap-2 text-sm text-text/70">
                  <CheckCircleIcon className="h-4 w-4 shrink-0" />
                  <span>Responded: {new Date(guest.respondedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {guest.notes && (
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-sm text-text/70">{guest.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/10">
              {/* Guest Count Control */}
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-surface px-2 py-1.5">
                <span className="text-xs font-medium text-text/70">People:</span>
                <button
                  onClick={() => handleDecrementCount(guest.id)}
                  disabled={(guest.guestCount || 1) <= 1}
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-text/60 hover:bg-primary/10 hover:text-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Decrease count"
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center text-xs font-semibold text-text">
                  {guest.guestCount || 1}
                </span>
                <button
                  onClick={() => handleIncrementCount(guest.id)}
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-text/60 hover:bg-primary/10 hover:text-primary transition"
                  title="Increase count"
                >
                  +
                </button>
              </div>
              
              <select
                value={guest.rsvpStatus}
                onChange={(e) => handleStatusChange(guest.id, e.target.value as TRsvpStatus)}
                className="rounded-lg border border-primary/20 bg-surface px-3 py-1.5 text-xs text-text focus:border-primary focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="invited">Invited</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
                <option value="no-response">No Response</option>
              </select>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSideColumn = (side: TGuestSide, sideGuests: TGuest[], title: string, color: string) => (
    <div className="flex flex-col">
      <div className={clsx('mb-4 rounded-lg border p-4', color)}>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 text-sm text-text/60">{sideGuests.length} guests</p>
      </div>
      <div className="space-y-3">
        {sideGuests.length > 0 ? (
          sideGuests.map(renderGuestCard)
        ) : (
          <div className="rounded-lg border border-dashed border-primary/20 bg-surface/50 p-8 text-center">
            <UserIcon className="mx-auto h-8 w-8 text-primary/40" />
            <p className="mt-2 text-sm text-text/60">No guests on this side yet</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <div className="flex rounded-lg border border-primary/20 bg-surface p-1">
          <button
            onClick={() => setMobileActiveSide('bride')}
            className={clsx(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition',
              mobileActiveSide === 'bride'
                ? 'bg-primary text-background'
                : 'text-text/60 hover:text-text'
            )}
          >
            Bride ({brideGuests.length})
          </button>
          <button
            onClick={() => setMobileActiveSide('mutual')}
            className={clsx(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition',
              mobileActiveSide === 'mutual'
                ? 'bg-primary text-background'
                : 'text-text/60 hover:text-text'
            )}
          >
            Mutual ({mutualGuests.length})
          </button>
          <button
            onClick={() => setMobileActiveSide('groom')}
            className={clsx(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition',
              mobileActiveSide === 'groom'
                ? 'bg-primary text-background'
                : 'text-text/60 hover:text-text'
            )}
          >
            Groom ({groomGuests.length})
          </button>
        </div>
      </div>

      {/* Desktop Split View / Mobile Tab View */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Bride Side */}
        <div className={clsx(mobileActiveSide === 'bride' ? 'block' : 'hidden', 'lg:block')}>
          {renderSideColumn('bride', brideGuests, "Bride's Side", 'bg-gradient-to-br from-rose-50/50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/20 border-rose-200/50 dark:border-rose-900/50')}
        </div>

        {/* Mutual */}
        <div className={clsx(mobileActiveSide === 'mutual' ? 'block' : 'hidden', 'lg:block')}>
          {renderSideColumn('mutual', mutualGuests, 'Mutual', 'bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-900/50')}
        </div>

        {/* Groom Side */}
        <div className={clsx(mobileActiveSide === 'groom' ? 'block' : 'hidden', 'lg:block')}>
          {renderSideColumn('groom', groomGuests, "Groom's Side", 'bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-900/50')}
        </div>
      </div>
    </div>
  )
}

