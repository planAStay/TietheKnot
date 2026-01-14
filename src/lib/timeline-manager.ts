import { TTimelineMilestone, TChecklistItem, TTaskPriority } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const TIMELINE_MILESTONES_KEY = 'ttk_timeline_milestones'
const CHECKLIST_ITEMS_KEY = 'ttk_checklist_items'

// Default wedding planning milestones (relative to wedding date)
export const DEFAULT_MILESTONES: Omit<TTimelineMilestone, 'id'>[] = [
  {
    title: '12-6 Months Before',
    description: 'Early planning and major decisions',
    monthsBefore: 12,
    color: 'blue',
  },
  {
    title: '6-3 Months Before',
    description: 'Dress fittings, catering, and invitations',
    monthsBefore: 6,
    color: 'purple',
  },
  {
    title: '3-1 Months Before',
    description: 'Final confirmations and rehearsals',
    monthsBefore: 3,
    color: 'pink',
  },
  {
    title: '1 Month Before',
    description: 'Final payments and day-of preparations',
    monthsBefore: 1,
    color: 'orange',
  },
  {
    title: 'Final Week',
    description: 'Last-minute details and relaxation',
    monthsBefore: 0.25, // 1 week = 0.25 months
    color: 'red',
  },
]

// Default checklist items organized by milestone (based on monthsBefore)
export const DEFAULT_CHECKLIST_ITEMS: Omit<TChecklistItem, 'id' | 'milestoneId'>[] = [
  // 12-6 Months Before
  {
    title: 'Set wedding budget',
    description: 'Determine overall budget and allocate to categories',
    isCompleted: false,
    category: 'Budget',
    priority: 'high',
    notes: 'Review with partner and family if needed',
  },
  {
    title: 'Book wedding venue',
    description: 'Research and book ceremony and reception venues',
    isCompleted: false,
    category: 'Venue',
    priority: 'urgent',
  },
  {
    title: 'Hire photographer',
    description: 'Book photographer and videographer',
    isCompleted: false,
    category: 'Photography',
    priority: 'high',
  },
  {
    title: 'Create guest list',
    description: 'Compile initial guest list and collect addresses',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'medium',
  },
  {
    title: 'Book caterer',
    description: 'Research and book catering services',
    isCompleted: false,
    category: 'Catering',
    priority: 'high',
  },
  {
    title: 'Book florist',
    description: 'Choose and book florist for bouquets and decorations',
    isCompleted: false,
    category: 'Décor',
    priority: 'medium',
  },
  // 6-3 Months Before
  {
    title: 'Order wedding dress',
    description: 'Finalize dress selection and place order',
    isCompleted: false,
    category: 'Attire',
    priority: 'high',
  },
  {
    title: 'Book hair and makeup artist',
    description: 'Schedule trial and book day-of services',
    isCompleted: false,
    category: 'Beauty',
    priority: 'medium',
  },
  {
    title: 'Order invitations',
    description: 'Design, order, and prepare invitations for mailing',
    isCompleted: false,
    category: 'Stationery',
    priority: 'medium',
  },
  {
    title: 'Book entertainment',
    description: 'Book DJ, band, or other entertainment',
    isCompleted: false,
    category: 'Entertainment',
    priority: 'medium',
  },
  {
    title: 'Plan honeymoon',
    description: 'Research and book honeymoon destination',
    isCompleted: false,
    category: 'Travel',
    priority: 'low',
  },
  {
    title: 'Reserve hotel rooms',
    description: 'Block hotel rooms for out-of-town guests',
    isCompleted: false,
    category: 'Accommodation',
    priority: 'low',
  },
  // 3-1 Months Before
  {
    title: 'Send invitations',
    description: 'Mail invitations and set RSVP deadline',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'high',
  },
  {
    title: 'Final dress fitting',
    description: 'Attend final dress fitting and pick up',
    isCompleted: false,
    category: 'Attire',
    priority: 'high',
  },
  {
    title: 'Create seating chart',
    description: 'Plan seating arrangements for reception',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'medium',
  },
  {
    title: 'Schedule rehearsal',
    description: 'Coordinate rehearsal date and time',
    isCompleted: false,
    category: 'Ceremony',
    priority: 'medium',
  },
  {
    title: 'Finalize vendor details',
    description: 'Confirm times, locations, and requirements with all vendors',
    isCompleted: false,
    category: 'Coordination',
    priority: 'high',
  },
  {
    title: 'Order wedding favors',
    description: 'Select and order guest favors',
    isCompleted: false,
    category: 'Gifts',
    priority: 'low',
  },
  // 1 Month Before
  {
    title: 'Confirm final guest count',
    description: 'Finalize RSVP count and inform vendors',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'urgent',
  },
  {
    title: 'Make final payments',
    description: 'Complete final payments to vendors',
    isCompleted: false,
    category: 'Budget',
    priority: 'high',
  },
  {
    title: 'Create day-of timeline',
    description: 'Draft detailed timeline for wedding day',
    isCompleted: false,
    category: 'Coordination',
    priority: 'high',
  },
  {
    title: 'Write vows',
    description: 'Write or finalize ceremony vows',
    isCompleted: false,
    category: 'Ceremony',
    priority: 'medium',
  },
  {
    title: 'Break in wedding shoes',
    description: 'Wear wedding shoes around the house',
    isCompleted: false,
    category: 'Attire',
    priority: 'low',
  },
  // Final Week
  {
    title: 'Final vendor confirmations',
    description: 'Call all vendors to confirm arrival times',
    isCompleted: false,
    category: 'Coordination',
    priority: 'urgent',
  },
  {
    title: 'Pack for honeymoon',
    description: 'Prepare luggage and documents for honeymoon',
    isCompleted: false,
    category: 'Travel',
    priority: 'medium',
  },
  {
    title: 'Prepare wedding day emergency kit',
    description: 'Assemble kit with safety pins, tissues, etc.',
    isCompleted: false,
    category: 'Coordination',
    priority: 'low',
  },
  {
    title: 'Delegate day-of tasks',
    description: 'Assign tasks to wedding party and helpers',
    isCompleted: false,
    category: 'Coordination',
    priority: 'medium',
  },
  {
    title: 'Get plenty of rest',
    description: 'Prioritize sleep and self-care',
    isCompleted: false,
    category: 'Wellness',
    priority: 'medium',
  },
]

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Calculate dates for a milestone based on wedding date
export function calculateMilestoneDates(
  milestone: TTimelineMilestone,
  weddingDate: string
): { startDate: string; endDate: string } {
  if (milestone.customStartDate && milestone.customEndDate) {
    return {
      startDate: milestone.customStartDate,
      endDate: milestone.customEndDate,
    }
  }

  const wedding = new Date(weddingDate)
  const monthsBefore = milestone.monthsBefore

  // Calculate end date (when milestone period ends, closer to wedding)
  const endDate = new Date(wedding)
  endDate.setMonth(wedding.getMonth() - monthsBefore)

  // Calculate start date (beginning of milestone period)
  // Each milestone covers roughly half the period to the next milestone
  // For simplicity, we'll make it cover a period based on monthsBefore
  let periodMonths = 2 // Default 2 month period
  if (monthsBefore >= 6) {
    periodMonths = 6 // 12-6 months: 6 month period
  } else if (monthsBefore >= 3) {
    periodMonths = 3 // 6-3 months: 3 month period
  } else if (monthsBefore >= 1) {
    periodMonths = 2 // 3-1 months: 2 month period
  } else if (monthsBefore >= 0.25) {
    periodMonths = 0.75 // 1 month: 3 weeks before
  } else {
    periodMonths = 0.25 // Final week: 1 week
  }

  const startDate = new Date(endDate)
  startDate.setMonth(endDate.getMonth() - periodMonths)

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

// Recalculate all milestone dates based on wedding date
export function recalculateAllMilestoneDates(weddingDate: string | null | undefined): void {
  if (!weddingDate) return

  const milestones = getTimelineMilestones()
  const updated = milestones.map((milestone) => {
    const dates = calculateMilestoneDates(milestone, weddingDate)
    return {
      ...milestone,
      startDate: dates.startDate,
      endDate: dates.endDate,
    }
  })
  writeStorage(TIMELINE_MILESTONES_KEY, updated)
}

// Milestone operations
export function getTimelineMilestones(): TTimelineMilestone[] {
  const stored = readStorage<TTimelineMilestone[]>(TIMELINE_MILESTONES_KEY, [])
  if (stored.length === 0) {
    // Initialize with default milestones
    const defaults: TTimelineMilestone[] = DEFAULT_MILESTONES.map((milestone) => ({
      ...milestone,
      id: generateId(),
    }))
    writeStorage(TIMELINE_MILESTONES_KEY, defaults)
    return defaults
  }
  return stored
}

export function addTimelineMilestone(
  milestone: Omit<TTimelineMilestone, 'id'>
): TTimelineMilestone[] {
  const milestones = getTimelineMilestones()
  const newMilestone: TTimelineMilestone = {
    ...milestone,
    id: generateId(),
  }
  const updated = [...milestones, newMilestone].sort((a, b) => {
    // Sort by monthsBefore descending (12 months before comes first)
    return (b.monthsBefore || 0) - (a.monthsBefore || 0)
  })
  writeStorage(TIMELINE_MILESTONES_KEY, updated)
  return updated
}

export function updateTimelineMilestone(
  milestoneId: string,
  updates: Partial<Omit<TTimelineMilestone, 'id'>>
): TTimelineMilestone[] {
  const milestones = getTimelineMilestones()
  const updated = milestones.map((milestone) =>
    milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
  )
  writeStorage(TIMELINE_MILESTONES_KEY, updated)
  return updated
}

export function deleteTimelineMilestone(milestoneId: string): TTimelineMilestone[] {
  const milestones = getTimelineMilestones()
  const updated = milestones.filter((milestone) => milestone.id !== milestoneId)

  // Also delete associated checklist items
  const items = getChecklistItems()
  const remainingItems = items.filter((item) => item.milestoneId !== milestoneId)
  writeStorage(CHECKLIST_ITEMS_KEY, remainingItems)

  writeStorage(TIMELINE_MILESTONES_KEY, updated)
  return updated
}

// Checklist item operations
export function getChecklistItems(): TChecklistItem[] {
  return readStorage<TChecklistItem[]>(CHECKLIST_ITEMS_KEY, [])
}

export function getChecklistItemsByMilestone(milestoneId: string): TChecklistItem[] {
  const items = getChecklistItems()
  return items.filter((item) => item.milestoneId === milestoneId)
}

export function addChecklistItem(
  item: Omit<TChecklistItem, 'id'>
): TChecklistItem[] {
  const items = getChecklistItems()
  const newItem: TChecklistItem = {
    ...item,
    id: generateId(),
  }
  const updated = [...items, newItem]
  writeStorage(CHECKLIST_ITEMS_KEY, updated)
  return updated
}

export function updateChecklistItem(
  itemId: string,
  updates: Partial<Omit<TChecklistItem, 'id'>>
): TChecklistItem[] {
  const items = getChecklistItems()
  const updated = items.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  )
  writeStorage(CHECKLIST_ITEMS_KEY, updated)
  return updated
}

export function toggleChecklistItem(itemId: string): TChecklistItem[] {
  const items = getChecklistItems()
  const updated = items.map((item) =>
    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
  )
  writeStorage(CHECKLIST_ITEMS_KEY, updated)
  return updated
}

export function deleteChecklistItem(itemId: string): TChecklistItem[] {
  const items = getChecklistItems()
  const updated = items.filter((item) => item.id !== itemId)
  writeStorage(CHECKLIST_ITEMS_KEY, updated)
  return updated
}

// Initialize default checklist items for milestones
export function initializeDefaultChecklistItems(weddingDate?: string | null): void {
  const existingItems = getChecklistItems()
  if (existingItems.length > 0) {
    // Don't reinitialize if items already exist
    return
  }

  const milestones = getTimelineMilestones()
  const newItems: TChecklistItem[] = []

  // Assign default items to milestones based on monthsBefore
  DEFAULT_CHECKLIST_ITEMS.forEach((item, index) => {
    let targetMilestone: TTimelineMilestone | undefined

    // Match items to milestones based on their position in the DEFAULT_CHECKLIST_ITEMS array
    if (index < 6) {
      // First 6 items -> 12-6 months
      targetMilestone = milestones.find((m) => m.monthsBefore >= 6 && m.monthsBefore <= 12)
    } else if (index < 12) {
      // Items 6-11 -> 6-3 months
      targetMilestone = milestones.find((m) => m.monthsBefore >= 3 && m.monthsBefore < 6)
    } else if (index < 18) {
      // Items 12-17 -> 3-1 months
      targetMilestone = milestones.find((m) => m.monthsBefore >= 1 && m.monthsBefore < 3)
    } else if (index < 23) {
      // Items 18-22 -> 1 month
      targetMilestone = milestones.find((m) => m.monthsBefore >= 0.25 && m.monthsBefore < 1)
    } else {
      // Items 23+ -> Final week
      targetMilestone = milestones.find((m) => m.monthsBefore < 0.25)
    }

    if (targetMilestone) {
      newItems.push({
        ...item,
        id: generateId(),
        milestoneId: targetMilestone.id,
      })
    }
  })

  if (newItems.length > 0) {
    writeStorage(CHECKLIST_ITEMS_KEY, newItems)
  }
}

// Get progress statistics
export function getMilestoneProgress(milestoneId: string): {
  total: number
  completed: number
  percentage: number
} {
  const items = getChecklistItemsByMilestone(milestoneId)
  const total = items.length
  const completed = items.filter((item) => item.isCompleted).length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, percentage }
}

export function getOverallProgress(): {
  total: number
  completed: number
  percentage: number
} {
  const items = getChecklistItems()
  const total = items.length
  const completed = items.filter((item) => item.isCompleted).length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, percentage }
}

// Get tasks by date range
export function getTasksByDateRange(startDate: string, endDate: string): TChecklistItem[] {
  const items = getChecklistItems()
  return items.filter((item) => {
    if (!item.dueDate) return false
    const due = new Date(item.dueDate)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return due >= start && due <= end
  })
}

// Get overdue tasks
export function getOverdueTasks(): TChecklistItem[] {
  const items = getChecklistItems()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return items.filter((item) => {
    if (!item.dueDate || item.isCompleted) return false
    const due = new Date(item.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  })
}

// Get upcoming tasks (within next 7 days)
export function getUpcomingTasks(): TChecklistItem[] {
  const items = getChecklistItems()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  return items.filter((item) => {
    if (!item.dueDate || item.isCompleted) return false
    const due = new Date(item.dueDate)
    due.setHours(0, 0, 0, 0)
    return due >= today && due <= weekFromNow
  })
}

