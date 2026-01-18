'use client'

import { TGuest, TGuestHousehold, TGuestSide, TRsvpStatus, TPriorityTier, TRelationshipLabel } from '@/type'
import { useState, useEffect } from 'react'
import { DialogTitle, DialogBody, DialogActions } from '@/components/dialog'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
  guest: TGuest | null
  households: TGuestHousehold[]
  onSave: (guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

const RELATIONSHIP_LABELS: TRelationshipLabel[] = [
  'Extended Family',
  'Immediate Family',
  'College Friends',
  'Work',
  'High School Friends',
  'Childhood Friends',
  'Out of Town',
  'Vendor',
  'Other',
]

export default function GuestEntryForm({ guest, households, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [side, setSide] = useState<TGuestSide>('bride')
  const [rsvpStatus, setRsvpStatus] = useState<TRsvpStatus>('draft')
  const [priorityTier, setPriorityTier] = useState<TPriorityTier>('tier1')
  const [relationshipLabels, setRelationshipLabels] = useState<TRelationshipLabel[]>([])
  const [householdId, setHouseholdId] = useState<string>('')
  const [guestCount, setGuestCount] = useState(1)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (guest) {
      setName(guest.name)
      setEmail(guest.email || '')
      setPhone(guest.phone || '')
      setSide(guest.side)
      setRsvpStatus(guest.rsvpStatus)
      setPriorityTier(guest.priorityTier)
      setRelationshipLabels(guest.relationshipLabels)
      setHouseholdId(guest.householdId || '')
      setGuestCount(guest.guestCount || 1)
      setNotes(guest.notes || '')
    }
  }, [guest])

  const handleRelationshipLabelToggle = (label: TRelationshipLabel) => {
    setRelationshipLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Name is required')
      return
    }

    onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      side,
      rsvpStatus,
      priorityTier,
      relationshipLabels,
      householdId: householdId || undefined,
      guestCount: Math.max(1, guestCount), // Minimum 1 person
      thankYouSent: guest?.thankYouSent || false,
      notes: notes.trim() || undefined,
      invitedAt: guest?.invitedAt,
      respondedAt: guest?.respondedAt,
      openedInviteAt: guest?.openedInviteAt,
      viewedRsvpAt: guest?.viewedRsvpAt,
      thankYouSentAt: guest?.thankYouSentAt,
      lastReminderSentAt: guest?.lastReminderSentAt,
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <DialogTitle>{guest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-text/60 hover:bg-primary/10 hover:text-primary transition"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <DialogBody>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Name *</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guest name"
                required
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Phone</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Side and RSVP Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Side</label>
                <Select value={side} onChange={(e) => setSide(e.target.value as TGuestSide)}>
                  <option value="bride">Bride&apos;s Side</option>
                  <option value="groom">Groom&apos;s Side</option>
                  <option value="mutual">Mutual</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">RSVP Status</label>
                <Select value={rsvpStatus} onChange={(e) => setRsvpStatus(e.target.value as TRsvpStatus)}>
                  <option value="draft">Draft</option>
                  <option value="invited">Invited</option>
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                  <option value="no-response">No Response</option>
                </Select>
              </div>
            </div>

            {/* Priority Tier and Household */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Priority Tier</label>
                <Select value={priorityTier} onChange={(e) => setPriorityTier(e.target.value as TPriorityTier)}>
                  <option value="tier1">Tier 1 (Must-Invite)</option>
                  <option value="tier2">Tier 2 (Waiting List)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Household</label>
                <Select value={householdId} onChange={(e) => setHouseholdId(e.target.value)}>
                  <option value="">None</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Relationship Labels */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Relationship Labels</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {RELATIONSHIP_LABELS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleRelationshipLabelToggle(label)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      relationshipLabels.includes(label)
                        ? 'bg-primary text-background'
                        : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count (for families/groups) */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Number of People (e.g., 1 for single guest, 4 for a family)
              </label>
              <Input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="1"
              />
              <p className="mt-1 text-xs text-text/60">
                This represents the total number of people for this guest entry (e.g., &quot;The Smith Family&quot; = 4 people)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this guest..."
                rows={4}
              />
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button type="button" plain onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="dark/zinc">
            {guest ? 'Update Guest' : 'Add Guest'}
          </Button>
        </DialogActions>
      </form>
    </div>
  )
}

