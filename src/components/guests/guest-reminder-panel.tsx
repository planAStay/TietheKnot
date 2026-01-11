'use client'

import { TGuest } from '@/type'
import { getGuestsNeedingReminders, sendMockReminder, sendMockReminders } from '@/lib/guest-manager'
import { DialogTitle, DialogBody, DialogActions } from '@/components/dialog'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useState, useEffect } from 'react'
import { XMarkIcon, BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Props {
  guests: TGuest[]
  onClose: () => void
}

export default function GuestReminderPanel({ guests, onClose }: Props) {
  const [deadline, setDeadline] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7) // Default to 7 days from now
    return date.toISOString().split('T')[0]
  })
  const [needingReminders, setNeedingReminders] = useState<TGuest[]>([])
  const [sentReminders, setSentReminders] = useState<Set<string>>(new Set())
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (deadline) {
      const guestsNeeding = getGuestsNeedingReminders(deadline)
      setNeedingReminders(guestsNeeding)
    }
  }, [deadline, guests])

  const handleSendReminder = async (guestId: string) => {
    setIsSending(true)
    try {
      sendMockReminder(guestId)
      setSentReminders((prev) => new Set(prev).add(guestId))
      // Refresh the list
      const updated = getGuestsNeedingReminders(deadline)
      setNeedingReminders(updated)
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Failed to send reminder. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendAllReminders = async () => {
    if (!confirm(`Send reminders to all ${needingReminders.length} guests who haven't responded?`)) {
      return
    }

    setIsSending(true)
    try {
      const guestIds = needingReminders.map((g) => g.id)
      sendMockReminders(guestIds)
      setSentReminders(new Set(guestIds))
      alert(`[MOCK] Reminders sent to ${guestIds.length} guests. In production, this would send real emails/SMS.`)
      // Refresh the list
      const updated = getGuestsNeedingReminders(deadline)
      setNeedingReminders(updated)
    } catch (error) {
      console.error('Error sending reminders:', error)
      alert('Failed to send reminders. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <DialogTitle>Send Reminders</DialogTitle>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-text/60 hover:bg-primary/10 hover:text-primary transition"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <DialogBody>
        <div className="space-y-6">
          {/* Deadline Selector */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              RSVP Deadline (guests invited before this date who haven&apos;t responded will be listed)
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-primary/20 bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text">Guests Needing Reminders</div>
                <div className="mt-1 text-2xl font-bold text-text">{needingReminders.length}</div>
              </div>
              {needingReminders.length > 0 && (
                <Button
                  color="amber"
                  onClick={handleSendAllReminders}
                  disabled={isSending}
                >
                  <BellIcon className="h-4 w-4" data-slot="icon" />
                  Send All Reminders
                </Button>
              )}
            </div>
          </div>

          {/* Guests List */}
          {needingReminders.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {needingReminders.map((guest) => {
                const hasSent = sentReminders.has(guest.id)
                const daysSinceInvited = guest.invitedAt
                  ? Math.floor((new Date().getTime() - new Date(guest.invitedAt).getTime()) / (1000 * 60 * 60 * 24))
                  : null

                return (
                  <div
                    key={guest.id}
                    className={clsx(
                      'rounded-lg border p-4 transition',
                      hasSent
                        ? 'border-green-500/20 bg-green-500/10'
                        : 'border-primary/10 bg-surface hover:border-primary/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-text">{guest.name}</h4>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                            {guest.side}
                          </span>
                        </div>
                        {guest.email && (
                          <div className="mt-1 flex items-center gap-2 text-sm text-text/70">
                            <EnvelopeIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{guest.email}</span>
                          </div>
                        )}
                        {guest.invitedAt && daysSinceInvited !== null && (
                          <div className="mt-1 text-xs text-text/60">
                            Invited {daysSinceInvited} day{daysSinceInvited !== 1 ? 's' : ''} ago
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {hasSent ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                            Sent
                          </span>
                        ) : (
                          <Button
                            plain
                            onClick={() => handleSendReminder(guest.id)}
                            disabled={isSending}
                            className="text-sm"
                          >
                            <BellIcon className="h-4 w-4" data-slot="icon" />
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-primary/20 bg-surface/50 p-12 text-center">
              <BellIcon className="mx-auto h-12 w-12 text-primary/40" />
              <h3 className="mt-4 text-lg font-semibold text-text">No Reminders Needed</h3>
              <p className="mt-2 text-sm text-text/60">
                All guests have either responded or haven&apos;t been invited yet.
              </p>
            </div>
          )}

          {/* Info Note */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <BellIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-text/70">
                <div className="font-medium text-text mb-1">Mock Reminder System</div>
                <p>
                  This is a mock reminder system. Reminders are logged to the console. In production, this would integrate with
                  your email/SMS service to send actual reminders to guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogActions>
        <Button plain onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </div>
  )
}

