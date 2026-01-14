'use client'

import { useWedding } from '@/lib/wedding-context'
import { getGuestStats, getRsvpProgress, getGuestCountBySide } from '@/lib/guest-manager'
import GuestDualDashboard from '@/components/guests/guest-dual-dashboard'
import GuestAnalytics from '@/components/guests/guest-analytics'
import GuestEntryForm from '@/components/guests/guest-entry-form'
import GuestBulkImport from '@/components/guests/guest-bulk-import'
import GuestReminderPanel from '@/components/guests/guest-reminder-panel'
import GuestExportButton from '@/components/guests/guest-export-button'
import { TGuest } from '@/type'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'
import { Dialog } from '@/components/dialog'

export default function GuestsClient() {
  const {
    guests,
    households,
    addGuest,
    updateGuest,
    deleteGuest,
    refreshGuests,
  } = useWedding()

  const stats = getGuestStats()
  const rsvpProgress = getRsvpProgress()
  const brideCount = getGuestCountBySide('bride')
  const groomCount = getGuestCountBySide('groom')
  const mutualCount = getGuestCountBySide('mutual')
  const totalCount = stats.totalWithPlusOnes

  // State
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [isReminderPanelOpen, setIsReminderPanelOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<TGuest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'tier1' | 'tier2'>('all')
  const [activeSide, setActiveSide] = useState<'all' | 'bride' | 'groom' | 'mutual'>('all')

  const handleAddGuest = (guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>) => {
    addGuest(guest)
    setIsEntryFormOpen(false)
    setEditingGuest(null)
    refreshGuests()
  }

  const handleUpdateGuest = (guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, guest)
      setIsEntryFormOpen(false)
      setEditingGuest(null)
      refreshGuests()
    }
  }

  const handleEditGuest = (guest: TGuest) => {
    setEditingGuest(guest)
    setIsEntryFormOpen(true)
  }

  const handleDeleteGuest = (guestId: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      deleteGuest(guestId)
      refreshGuests()
    }
  }

  // Filter guests based on search and filters
  const filteredGuests = guests.filter((g) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        g.name.toLowerCase().includes(query) ||
        g.email?.toLowerCase().includes(query) ||
        g.phone?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Tier filter
    if (filterTier !== 'all' && g.priorityTier !== filterTier) return false

    // Side filter
    if (activeSide !== 'all' && g.side !== activeSide) return false

    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="container pt-24 pb-8 lg:pt-28">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/my-wedding"
            className="rounded-lg p-2 text-text/60 hover:bg-primary/10 hover:text-primary transition"
            aria-label="Back to dashboard"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-text sm:text-5xl">Guest Management</h1>
            <p className="mt-2 text-sm text-text/60">
              Manage your wedding guest list with RSVP tracking and analytics
            </p>
          </div>
        </div>

        {/* Live Count Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap gap-3"
        >
          <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-rose-50/50 to-rose-100/50 px-4 py-2.5 dark:from-rose-950/20 dark:to-rose-900/20">
            <div className="text-xs font-medium text-text/60">Bride Side</div>
            <div className="text-2xl font-bold text-text">{brideCount}</div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-blue-50/50 to-blue-100/50 px-4 py-2.5 dark:from-blue-950/20 dark:to-blue-900/20">
            <div className="text-xs font-medium text-text/60">Groom Side</div>
            <div className="text-2xl font-bold text-text">{groomCount}</div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-purple-50/50 to-purple-100/50 px-4 py-2.5 dark:from-purple-950/20 dark:to-purple-900/20">
            <div className="text-xs font-medium text-text/60">Mutual</div>
            <div className="text-2xl font-bold text-text">{mutualCount}</div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-surface to-surface/50 px-4 py-2.5">
            <div className="text-xs font-medium text-text/60">Total</div>
            <div className="text-2xl font-bold text-text">{totalCount}</div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 flex-1">
            <input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] rounded-full border border-primary/20 bg-surface px-4 py-2 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none"
            />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as 'all' | 'tier1' | 'tier2')}
              className="rounded-full border border-primary/20 bg-surface px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="tier1">Tier 1</option>
              <option value="tier2">Tier 2</option>
            </select>
            <select
              value={activeSide}
              onChange={(e) => setActiveSide(e.target.value as 'all' | 'bride' | 'groom' | 'mutual')}
              className="rounded-full border border-primary/20 bg-surface px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="all">All Sides</option>
              <option value="bride">Bride Side</option>
              <option value="groom">Groom Side</option>
              <option value="mutual">Mutual</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <GuestExportButton guests={guests} />
            <button
              onClick={() => setIsReminderPanelOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              <BellIcon className="h-4 w-4" />
              Send Reminders
            </button>
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-primary/10"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Bulk Import
            </button>
            <button
              onClick={() => {
                setEditingGuest(null)
                setIsEntryFormOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Add Guest
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {guests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GuestAnalytics guests={guests} rsvpProgress={rsvpProgress} stats={stats} />
          </motion.div>
        )}

        {/* Dual Dashboard */}
        {guests.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GuestDualDashboard
              guests={filteredGuests}
              households={households}
              onEditGuest={handleEditGuest}
              onDeleteGuest={handleDeleteGuest}
              onUpdateGuest={updateGuest}
              refreshGuests={refreshGuests}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-primary/20 bg-surface/50 p-12 text-center"
          >
            <UserGroupIcon className="mx-auto h-16 w-16 text-primary/40" />
            <h2 className="mt-4 text-2xl font-semibold text-text">No Guests Yet</h2>
            <p className="mt-2 text-sm text-text/60 max-w-md mx-auto">
              Start building your guest list by adding guests individually or importing from a spreadsheet.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setEditingGuest(null)
                  setIsEntryFormOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
              >
                <PlusIcon className="h-4 w-4" />
                Add First Guest
              </button>
              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-6 py-3 text-sm font-semibold text-text transition hover:bg-primary/10"
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                Import from Spreadsheet
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Entry Form Modal */}
      <Dialog
        open={isEntryFormOpen}
        onClose={() => {
          setIsEntryFormOpen(false)
          setEditingGuest(null)
        }}
        size="2xl"
      >
        <GuestEntryForm
          guest={editingGuest}
          households={households}
          onSave={editingGuest ? handleUpdateGuest : handleAddGuest}
          onClose={() => {
            setIsEntryFormOpen(false)
            setEditingGuest(null)
          }}
        />
      </Dialog>

      {/* Bulk Import Modal */}
      <Dialog open={isBulkImportOpen} onClose={() => setIsBulkImportOpen(false)} size="4xl">
        <GuestBulkImport
          onClose={() => setIsBulkImportOpen(false)}
          onImportSuccess={refreshGuests}
        />
      </Dialog>

      {/* Reminder Panel Modal */}
      <Dialog open={isReminderPanelOpen} onClose={() => setIsReminderPanelOpen(false)} size="4xl">
        <GuestReminderPanel
          guests={guests}
          onClose={() => setIsReminderPanelOpen(false)}
        />
      </Dialog>
    </div>
  )
}

