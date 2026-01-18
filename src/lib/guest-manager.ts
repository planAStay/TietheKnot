import { TGuest, TGuestHousehold, TGuestSide, TRsvpStatus, TPriorityTier, TRelationshipLabel } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const GUESTS_KEY = 'ttk_guests'
const GUEST_HOUSEHOLDS_KEY = 'ttk_guest_households'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Core Guest CRUD Operations
export function getGuests(): TGuest[] {
  const guests = readStorage<TGuest[]>(GUESTS_KEY, [])
  // Migrate existing guests to have guestCount field (backward compatibility)
  const needsMigration = guests.some(g => !g.guestCount || g.guestCount === undefined || isNaN(g.guestCount))
  if (needsMigration) {
    const migratedGuests = guests.map(g => {
      // If guest has old plusOneAllowed/plusOneCount fields, convert them
      if (!g.guestCount || g.guestCount === undefined || isNaN(g.guestCount)) {
        const oldCount = (g as any).plusOneCount !== undefined ? (g as any).plusOneCount : ((g as any).plusOneAllowed ? 1 : 0)
        const { plusOneAllowed, plusOneCount, ...guestWithoutOldFields } = g as any
        return {
          ...guestWithoutOldFields,
          guestCount: 1 + (oldCount || 0),
        } as TGuest
      }
      return g
    })
    writeStorage(GUESTS_KEY, migratedGuests)
    return migratedGuests
  }
  return guests
}

export function getGuest(guestId: string): TGuest | undefined {
  const guests = getGuests()
  return guests.find((g) => g.id === guestId)
}

export function addGuest(guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>): TGuest[] {
  const guests = getGuests()
  const now = new Date().toISOString()
  const newGuest: TGuest = {
    ...guest,
    guestCount: guest.guestCount || 1, // Ensure guestCount is always set, default to 1
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const updated = [...guests, newGuest]
  writeStorage(GUESTS_KEY, updated)
  return updated
}

export function updateGuest(guestId: string, updates: Partial<Omit<TGuest, 'id' | 'createdAt'>>): TGuest[] {
  const guests = getGuests()
  const updated = guests.map((g) =>
    g.id === guestId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
  )
  writeStorage(GUESTS_KEY, updated)
  return updated
}

export function deleteGuest(guestId: string): TGuest[] {
  const guests = getGuests()
  const updated = guests.filter((g) => g.id !== guestId)
  writeStorage(GUESTS_KEY, updated)
  
  // Remove from household if in one
  const households = getHouseholds()
  const updatedHouseholds = households.map((h) => ({
    ...h,
    memberIds: h.memberIds.filter((id) => id !== guestId),
    updatedAt: new Date().toISOString(),
  })).filter((h) => h.memberIds.length > 0) // Remove empty households
  writeStorage(GUEST_HOUSEHOLDS_KEY, updatedHouseholds)
  
  return updated
}

export function getGuestsBySide(side: TGuestSide): TGuest[] {
  const guests = getGuests()
  return guests.filter((g) => g.side === side)
}

export function getMutualGuests(): TGuest[] {
  return getGuestsBySide('mutual')
}

// Household Management
export function getHouseholds(): TGuestHousehold[] {
  return readStorage<TGuestHousehold[]>(GUEST_HOUSEHOLDS_KEY, [])
}

export function getHousehold(householdId: string): TGuestHousehold | undefined {
  const households = getHouseholds()
  return households.find((h) => h.id === householdId)
}

export function createHousehold(name: string, memberIds: string[] = []): TGuestHousehold[] {
  const households = getHouseholds()
  const now = new Date().toISOString()
  const newHousehold: TGuestHousehold = {
    id: generateId(),
    name,
    memberIds,
    createdAt: now,
    updatedAt: now,
  }
  const updated = [...households, newHousehold]
  writeStorage(GUEST_HOUSEHOLDS_KEY, updated)
  
  // Update guests to reference household
  if (memberIds.length > 0) {
    const guests = getGuests()
    const updatedGuests = guests.map((g) =>
      memberIds.includes(g.id) ? { ...g, householdId: newHousehold.id, updatedAt: now } : g
    )
    writeStorage(GUESTS_KEY, updatedGuests)
  }
  
  return updated
}

export function addToHousehold(householdId: string, guestId: string): TGuestHousehold[] {
  const households = getHouseholds()
  const household = households.find((h) => h.id === householdId)
  if (!household) return households
  
  const updated = households.map((h) =>
    h.id === householdId
      ? { ...h, memberIds: [...new Set([...h.memberIds, guestId])], updatedAt: new Date().toISOString() }
      : h
  )
  writeStorage(GUEST_HOUSEHOLDS_KEY, updated)
  
  // Update guest to reference household
  updateGuest(guestId, { householdId })
  
  return updated
}

export function removeFromHousehold(householdId: string, guestId: string): TGuestHousehold[] {
  const households = getHouseholds()
  const updated = households.map((h) =>
    h.id === householdId
      ? { ...h, memberIds: h.memberIds.filter((id) => id !== guestId), updatedAt: new Date().toISOString() }
      : h
  )
  writeStorage(GUEST_HOUSEHOLDS_KEY, updated)
  
  // Update guest to remove household reference
  updateGuest(guestId, { householdId: undefined })
  
  return updated
}

export function updateHousehold(householdId: string, updates: Partial<Omit<TGuestHousehold, 'id' | 'createdAt'>>): TGuestHousehold[] {
  const households = getHouseholds()
  const updated = households.map((h) =>
    h.id === householdId ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
  )
  writeStorage(GUEST_HOUSEHOLDS_KEY, updated)
  
  // If memberIds changed, update guests
  if (updates.memberIds) {
    const oldHousehold = households.find((h) => h.id === householdId)
    const guests = getGuests()
    const now = new Date().toISOString()
    
    // Remove householdId from old members
    const removedIds = oldHousehold?.memberIds.filter((id) => !updates.memberIds!.includes(id)) || []
    removedIds.forEach((id) => {
      updateGuest(id, { householdId: undefined })
    })
    
    // Add householdId to new members
    const addedIds = updates.memberIds.filter((id) => !oldHousehold?.memberIds.includes(id))
    addedIds.forEach((id) => {
      updateGuest(id, { householdId })
    })
  }
  
  return updated
}

export function deleteHousehold(householdId: string): TGuestHousehold[] {
  const households = getHouseholds()
  const updated = households.filter((h) => h.id !== householdId)
  writeStorage(GUEST_HOUSEHOLDS_KEY, updated)
  
  // Remove household reference from guests
  const guests = getGuests()
  const updatedGuests = guests.map((g) =>
    g.householdId === householdId ? { ...g, householdId: undefined, updatedAt: new Date().toISOString() } : g
  )
  writeStorage(GUESTS_KEY, updatedGuests)
  
  return updated
}

export function getHouseholdMembers(householdId: string): TGuest[] {
  const household = getHousehold(householdId)
  if (!household) return []
  const guests = getGuests()
  return guests.filter((g) => household.memberIds.includes(g.id))
}

// Guest Count Logic (for families/groups)
export function setGuestCount(guestId: string, count: number): TGuest[] {
  const guest = getGuest(guestId)
  if (!guest) return getGuests()
  
  if (count < 1) count = 1 // Minimum 1 person (the primary guest)
  
  return updateGuest(guestId, { guestCount: count })
}

export function incrementGuestCount(guestId: string): TGuest[] {
  const guest = getGuest(guestId)
  if (!guest) return getGuests()
  
  const currentCount = guest.guestCount || 1
  return updateGuest(guestId, { guestCount: currentCount + 1 })
}

export function decrementGuestCount(guestId: string): TGuest[] {
  const guest = getGuest(guestId)
  if (!guest) return getGuests()
  
  const currentCount = guest.guestCount || 1
  const newCount = Math.max(1, currentCount - 1) // Minimum 1
  return updateGuest(guestId, { guestCount: newCount })
}

export function getGuestCount(): number {
  const guests = getGuests()
  // Sum up all guest counts (each guest entry can represent multiple people)
  // Handle missing guestCount for backward compatibility
  return guests.reduce((sum, g) => {
    const count = g.guestCount || 1
    return sum + (isNaN(count) ? 1 : count)
  }, 0)
}

export function getGuestCountBySide(side: TGuestSide): number {
  const guests = getGuestsBySide(side)
  // Sum up all guest counts for this side
  // Handle missing guestCount for backward compatibility
  return guests.reduce((sum, g) => {
    const count = g.guestCount || 1
    return sum + (isNaN(count) ? 1 : count)
  }, 0)
}

// Analytics Helpers
export interface TGuestStats {
  total: number
  totalWithPlusOnes: number
  bride: { count: number; withPlusOnes: number }
  groom: { count: number; withPlusOnes: number }
  mutual: { count: number; withPlusOnes: number }
  byStatus: Record<TRsvpStatus, number>
  byTier: Record<TPriorityTier, number>
}

export function getGuestStats(): TGuestStats {
  const guests = getGuests()
  const stats: TGuestStats = {
    total: guests.length,
    totalWithPlusOnes: getGuestCount(),
    bride: {
      count: guests.filter((g) => g.side === 'bride').length,
      withPlusOnes: getGuestCountBySide('bride'),
    },
    groom: {
      count: guests.filter((g) => g.side === 'groom').length,
      withPlusOnes: getGuestCountBySide('groom'),
    },
    mutual: {
      count: guests.filter((g) => g.side === 'mutual').length,
      withPlusOnes: getGuestCountBySide('mutual'),
    },
    byStatus: {
      draft: 0,
      invited: 0,
      attending: 0,
      declined: 0,
      'no-response': 0,
    },
    byTier: {
      tier1: 0,
      tier2: 0,
    },
  }
  
  guests.forEach((g) => {
    stats.byStatus[g.rsvpStatus]++
    stats.byTier[g.priorityTier]++
  })
  
  return stats
}

export interface TRsvpProgress {
  attending: number
  pending: number // invited + draft
  declined: number
  noResponse: number
  total: number
  attendingPercent: number
  pendingPercent: number
  declinedPercent: number
  noResponsePercent: number
}

export function getRsvpProgress(): TRsvpProgress {
  const guests = getGuests()
  const attending = guests.filter((g) => g.rsvpStatus === 'attending').length
  const pending = guests.filter((g) => g.rsvpStatus === 'invited' || g.rsvpStatus === 'draft').length
  const declined = guests.filter((g) => g.rsvpStatus === 'declined').length
  const noResponse = guests.filter((g) => g.rsvpStatus === 'no-response').length
  const total = guests.length
  
  return {
    attending,
    pending,
    declined,
    noResponse,
    total,
    attendingPercent: total > 0 ? (attending / total) * 100 : 0,
    pendingPercent: total > 0 ? (pending / total) * 100 : 0,
    declinedPercent: total > 0 ? (declined / total) * 100 : 0,
    noResponsePercent: total > 0 ? (noResponse / total) * 100 : 0,
  }
}

export function getGuestsNeedingReminders(deadline: string): TGuest[] {
  const guests = getGuests()
  const deadlineDate = new Date(deadline).getTime()
  
  return guests.filter((g) => {
    // Needs reminder if:
    // 1. Status is 'invited' (not responded)
    // 2. Invite was sent before deadline
    // 3. No response yet
    if (g.rsvpStatus !== 'invited') return false
    if (!g.invitedAt) return false
    
    const invitedDate = new Date(g.invitedAt).getTime()
    return invitedDate < deadlineDate && !g.respondedAt
  })
}

// Mock Communication Functions
export function sendMockReminder(guestId: string): TGuest[] {
  console.log(`[MOCK] Sending reminder to guest: ${guestId}`)
  const guest = getGuest(guestId)
  if (guest) {
    console.log(`[MOCK] Reminder sent to ${guest.name} at ${guest.email || 'N/A'}`)
  }
  return updateGuest(guestId, { lastReminderSentAt: new Date().toISOString() })
}

export function sendMockReminders(guestIds: string[]): TGuest[] {
  console.log(`[MOCK] Sending reminders to ${guestIds.length} guests`)
  const guests = getGuests()
  const now = new Date().toISOString()
  const updated = guests.map((g) =>
    guestIds.includes(g.id) ? { ...g, lastReminderSentAt: now, updatedAt: now } : g
  )
  writeStorage(GUESTS_KEY, updated)
  
  // Log each reminder
  updated
    .filter((g) => guestIds.includes(g.id))
    .forEach((g) => {
      console.log(`[MOCK] Reminder sent to ${g.name} at ${g.email || 'N/A'}`)
    })
  
  return updated
}

export function markInviteOpened(guestId: string): TGuest[] {
  const guest = getGuest(guestId)
  if (!guest || guest.openedInviteAt) return getGuests() // Already opened
  
  console.log(`[MOCK] Invite opened by guest: ${guestId}`)
  return updateGuest(guestId, { openedInviteAt: new Date().toISOString() })
}

export function markRsvpViewed(guestId: string): TGuest[] {
  const guest = getGuest(guestId)
  if (!guest || guest.viewedRsvpAt) return getGuests() // Already viewed
  
  console.log(`[MOCK] RSVP page viewed by guest: ${guestId}`)
  return updateGuest(guestId, { viewedRsvpAt: new Date().toISOString() })
}

// Bulk Import - CSV
export interface TImportResult {
  success: boolean
  imported: number
  errors: Array<{ row: number; message: string }>
}

export function importGuestsFromCSV(
  csvText: string,
  columnMapping: Record<string, string>
): TImportResult {
  const lines = csvText.split('\n').filter((line) => line.trim())
  if (lines.length < 2) {
    return { success: false, imported: 0, errors: [{ row: 0, message: 'CSV must have at least a header and one data row' }] }
  }
  
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const errors: Array<{ row: number; message: string }> = []
  let imported = 0
  
  // Map column names to indices
  const columnIndices: Record<string, number> = {}
  Object.entries(columnMapping).forEach(([field, columnName]) => {
    const index = headers.findIndex((h) => h.toLowerCase() === columnName.toLowerCase())
    if (index !== -1) {
      columnIndices[field] = index
    }
  })
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    
    try {
      const name = columnIndices.name !== undefined ? values[columnIndices.name] : ''
      if (!name) {
        errors.push({ row: i + 1, message: 'Name is required' })
        continue
      }
      
      const email = columnIndices.email !== undefined ? values[columnIndices.email] : ''
      const phone = columnIndices.phone !== undefined ? values[columnIndices.phone] : ''
      const sideStr = (columnIndices.side !== undefined ? values[columnIndices.side] : 'bride').toLowerCase()
      const side: TGuestSide = sideStr === 'groom' ? 'groom' : sideStr === 'mutual' ? 'mutual' : 'bride'
      
      const priorityStr = (columnIndices.priority !== undefined ? values[columnIndices.priority] : 'tier1').toLowerCase()
      const priorityTier: TPriorityTier = priorityStr === 'tier2' ? 'tier2' : 'tier1'
      
      const relationshipStr = columnIndices.relationship !== undefined ? values[columnIndices.relationship] : ''
      const relationshipLabels: TRelationshipLabel[] = relationshipStr
        ? relationshipStr.split(';').map((r) => r.trim() as TRelationshipLabel).filter(Boolean)
        : []
      
      const guestCountStr = columnIndices.guestCount !== undefined ? values[columnIndices.guestCount] : ''
      const guestCount = guestCountStr ? parseInt(guestCountStr, 10) || 1 : 1
      const finalGuestCount = Math.max(1, guestCount) // Minimum 1
      
      const guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        side,
        rsvpStatus: 'draft',
        priorityTier,
        relationshipLabels,
        guestCount: finalGuestCount,
        thankYouSent: false,
      }
      
      addGuest(guest)
      imported++
    } catch (error) {
      errors.push({ row: i + 1, message: error instanceof Error ? error.message : 'Unknown error' })
    }
  }
  
  return {
    success: errors.length === 0,
    imported,
    errors,
  }
}

// Bulk Import - Excel
export async function importGuestsFromExcel(
  file: File,
  columnMapping: Record<string, string>
): Promise<TImportResult> {
  try {
    const XLSX = await import('xlsx')
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][]
    
    if (jsonData.length < 2) {
      return { success: false, imported: 0, errors: [{ row: 0, message: 'Excel must have at least a header and one data row' }] }
    }
    
    const headers = jsonData[0].map((h) => String(h).trim())
    const errors: Array<{ row: number; message: string }> = []
    let imported = 0
    
    // Map column names to indices
    const columnIndices: Record<string, number> = {}
    Object.entries(columnMapping).forEach(([field, columnName]) => {
      const index = headers.findIndex((h) => String(h).toLowerCase() === columnName.toLowerCase())
      if (index !== -1) {
        columnIndices[field] = index
      }
    })
    
    // Parse data rows
    for (let i = 1; i < jsonData.length; i++) {
      const values = jsonData[i].map((v) => String(v).trim())
      
      try {
        const name = columnIndices.name !== undefined ? values[columnIndices.name] : ''
        if (!name) {
          errors.push({ row: i + 1, message: 'Name is required' })
          continue
        }
        
        const email = columnIndices.email !== undefined ? values[columnIndices.email] : ''
        const phone = columnIndices.phone !== undefined ? values[columnIndices.phone] : ''
        const sideStr = (columnIndices.side !== undefined ? values[columnIndices.side] : 'bride').toLowerCase()
        const side: TGuestSide = sideStr === 'groom' ? 'groom' : sideStr === 'mutual' ? 'mutual' : 'bride'
        
        const priorityStr = (columnIndices.priority !== undefined ? values[columnIndices.priority] : 'tier1').toLowerCase()
        const priorityTier: TPriorityTier = priorityStr === 'tier2' ? 'tier2' : 'tier1'
        
        const relationshipStr = columnIndices.relationship !== undefined ? values[columnIndices.relationship] : ''
        const relationshipLabels: TRelationshipLabel[] = relationshipStr
          ? String(relationshipStr).split(';').map((r) => r.trim() as TRelationshipLabel).filter(Boolean)
          : []
        
        const guestCountStr = columnIndices.guestCount !== undefined ? values[columnIndices.guestCount] : ''
        const guestCount = guestCountStr ? parseInt(String(guestCountStr), 10) || 1 : 1
        const finalGuestCount = Math.max(1, guestCount) // Minimum 1
        
        const guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'> = {
          name,
          email: email || undefined,
          phone: phone || undefined,
          side,
          rsvpStatus: 'draft',
          priorityTier,
          relationshipLabels,
          guestCount: finalGuestCount,
          thankYouSent: false,
        }
        
        addGuest(guest)
        imported++
      } catch (error) {
        errors.push({ row: i + 1, message: error instanceof Error ? error.message : 'Unknown error' })
      }
    }
    
    return {
      success: errors.length === 0,
      imported,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      imported: 0,
      errors: [{ row: 0, message: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}` }],
    }
  }
}

// Export Functions
export function exportGuestsToCSV(filterAttendingOnly: boolean = false): string {
  const guests = getGuests()
  const filtered = filterAttendingOnly ? guests.filter((g) => g.rsvpStatus === 'attending') : guests
  const households = getHouseholds()
  
  const lines: string[] = []
      lines.push('Name,Email,Phone,Side,RSVP Status,Priority Tier,Relationship Labels,Guest Count,Household,Invited At,Responded At')
  
      filtered.forEach((g) => {
        const household = g.householdId ? households.find((h) => h.id === g.householdId) : null
        const relationshipLabels = g.relationshipLabels.join('; ')
        const invitedAt = g.invitedAt ? new Date(g.invitedAt).toLocaleDateString() : ''
        const respondedAt = g.respondedAt ? new Date(g.respondedAt).toLocaleDateString() : ''
        
        lines.push(
          `"${g.name}","${g.email || ''}","${g.phone || ''}","${g.side}","${g.rsvpStatus}","${g.priorityTier}","${relationshipLabels}","${g.guestCount}","${household?.name || ''}","${invitedAt}","${respondedAt}"`
        )
      })
  
  return lines.join('\n')
}

export async function exportGuestsToPDF(filterAttendingOnly: boolean = false): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default
  
  const guests = getGuests()
  const filtered = filterAttendingOnly ? guests.filter((g) => g.rsvpStatus === 'attending') : guests
  const households = getHouseholds()
  
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text(filterAttendingOnly ? 'Attending Guests List' : 'Guest List', 14, 20)
  
  let yPos = 30
  doc.setFontSize(11)
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, yPos)
  yPos += 7
  doc.text(`Total Guests: ${filtered.length}`, 14, yPos)
  yPos += 10
  
  // Guest data
  const guestData = filtered.map((g) => {
    const household = g.householdId ? households.find((h) => h.id === g.householdId) : null
    const relationshipLabels = g.relationshipLabels.join(', ')
    const invitedAt = g.invitedAt ? new Date(g.invitedAt).toLocaleDateString() : 'N/A'
    const respondedAt = g.respondedAt ? new Date(g.respondedAt).toLocaleDateString() : 'N/A'
    
    return [
      g.name,
      g.email || 'N/A',
      g.phone || 'N/A',
      g.side,
      g.rsvpStatus,
      g.priorityTier,
      relationshipLabels || 'N/A',
      g.guestCount.toString(),
      household?.name || 'N/A',
      invitedAt,
      respondedAt,
    ]
  })
  
  autoTable(doc, {
    startY: yPos,
    head: [['Name', 'Email', 'Phone', 'Side', 'RSVP Status', 'Priority', 'Relationships', 'Guest Count', 'Household', 'Invited', 'Responded']],
    body: guestData,
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 40 },
      7: { cellWidth: 15 },
      8: { cellWidth: 30 },
      9: { cellWidth: 25 },
      10: { cellWidth: 25 },
    },
  })
  
  // Save
  const filename = `wedding-guests-${filterAttendingOnly ? 'attending-' : ''}${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

