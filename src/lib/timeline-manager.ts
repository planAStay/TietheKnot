import { TTimelineMilestone, TChecklistItem, TTaskPriority } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const TIMELINE_MILESTONES_KEY = 'ttk_timeline_milestones'
const CHECKLIST_ITEMS_KEY = 'ttk_checklist_items'

// Default wedding planning milestones (relative to wedding date)
// Exactly 4 phases matching the UI: 0-1 month, 1-3 months, 3-6 months, 6-12 months
export const DEFAULT_MILESTONES: Omit<TTimelineMilestone, 'id'>[] = [
  {
    title: '6-12 Months Before',
    description: 'Early planning and major decisions',
    monthsBefore: 12,
    color: 'blue',
  },
  {
    title: '3-6 Months Before',
    description: 'Mid-planning tasks and vendor bookings',
    monthsBefore: 6,
    color: 'purple',
  },
  {
    title: '1-3 Months Before',
    description: 'Final confirmations and preparations',
    monthsBefore: 3,
    color: 'pink',
  },
  {
    title: '0-1 Month Before',
    description: 'Final details and day-of preparations',
    monthsBefore: 1,
    color: 'orange',
  },
]

// Default checklist items - exactly 16 tasks organized into 4 phases
// Phase 1 (0-1 month): Tasks 1-4
// Phase 2 (1-3 months): Tasks 5-8
// Phase 3 (3-6 months): Tasks 9-12
// Phase 4 (6-12 months): Tasks 13-16
export const DEFAULT_CHECKLIST_ITEMS: Omit<TChecklistItem, 'id' | 'milestoneId'>[] = [
  // Phase 1 (0-1 month) - Tasks 1-4
  {
    title: 'Find and save venues',
    description: 'Research and save your favorite wedding venues',
    isCompleted: false,
    category: 'Venue',
    priority: 'urgent',
  },
  {
    title: 'Start your budget',
    description: 'Set your wedding budget and track expenses',
    isCompleted: false,
    category: 'Budget',
    priority: 'high',
  },
  {
    title: 'Start your guest list',
    description: 'Create your initial guest list',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'high',
  },
  {
    title: 'Connect with Photographers',
    description: 'Browse and connect with photographers',
    isCompleted: false,
    category: 'Photography',
    priority: 'high',
  },
  // Phase 2 (1-3 months) - Tasks 5-8
  {
    title: 'Browse bands and DJs',
    description: 'Explore entertainment options for your wedding',
    isCompleted: false,
    category: 'Entertainment',
    priority: 'medium',
  },
  {
    title: 'Contact caterers',
    description: 'Reach out to catering services',
    isCompleted: false,
    category: 'Catering',
    priority: 'high',
  },
  {
    title: 'Order Invitations',
    description: 'Design and order your wedding invitations',
    isCompleted: false,
    category: 'Stationery',
    priority: 'medium',
  },
  {
    title: 'Shortlist florists',
    description: 'Find and shortlist florists for your wedding',
    isCompleted: false,
    category: 'Décor',
    priority: 'medium',
  },
  // Phase 3 (3-6 months) - Tasks 9-12
  {
    title: 'Set up beauty trials',
    description: 'Schedule hair and makeup trials',
    isCompleted: false,
    category: 'Beauty',
    priority: 'medium',
  },
  {
    title: 'Meet with wedding planners',
    description: 'Connect with wedding planners and coordinators',
    isCompleted: false,
    category: 'Planning',
    priority: 'medium',
  },
  {
    title: 'Find attire',
    description: 'Shop for wedding attire',
    isCompleted: false,
    category: 'Attire',
    priority: 'high',
  },
  {
    title: 'Find rings',
    description: 'Select wedding rings',
    isCompleted: false,
    category: 'Accessories',
    priority: 'medium',
  },
  // Phase 4 (6-12 months) - Tasks 13-16
  {
    title: 'Sample cakes',
    description: 'Taste and select your wedding cake',
    isCompleted: false,
    category: 'Catering',
    priority: 'medium',
  },
  {
    title: 'Explore more vendors',
    description: 'Discover additional vendors for your wedding',
    isCompleted: false,
    category: 'Vendors',
    priority: 'low',
  },
  {
    title: 'Collect RSVPs',
    description: 'Track and collect RSVPs from guests',
    isCompleted: false,
    category: 'Guest Management',
    priority: 'high',
  },
  {
    title: 'Get married!',
    description: 'Your special day has arrived',
    isCompleted: false,
    category: 'Wedding',
    priority: 'urgent',
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
// This will replace all existing items with the default 16 tasks
export function initializeDefaultChecklistItems(weddingDate?: string | null): void {
  const existingItems = getChecklistItems()
  const expectedTitles = DEFAULT_CHECKLIST_ITEMS.map(item => item.title)
  const existingTitles = existingItems.map(item => item.title)
  
  // Check if existing items match the new default list
  const titlesMatch = expectedTitles.length === existingTitles.length &&
    expectedTitles.every(title => existingTitles.includes(title))
  
  // Only reinitialize if items don't exist or don't match the new defaults
  if (existingItems.length > 0 && titlesMatch) {
    return
  }

  const milestones = getTimelineMilestones()
  const newItems: TChecklistItem[] = []

  // Sort milestones by monthsBefore descending to match phase order
  // Phase 1 (0-1 month): monthsBefore = 1
  // Phase 2 (1-3 months): monthsBefore = 3
  // Phase 3 (3-6 months): monthsBefore = 6
  // Phase 4 (6-12 months): monthsBefore = 12
  const sortedMilestones = [...milestones].sort((a, b) => (b.monthsBefore || 0) - (a.monthsBefore || 0))
  
  // Get milestones in the correct order for phases
  const phase1Milestone = sortedMilestones.find((m) => m.monthsBefore === 1) || sortedMilestones[3] || sortedMilestones[0]
  const phase2Milestone = sortedMilestones.find((m) => m.monthsBefore === 3) || sortedMilestones[2] || sortedMilestones[0]
  const phase3Milestone = sortedMilestones.find((m) => m.monthsBefore === 6) || sortedMilestones[1] || sortedMilestones[0]
  const phase4Milestone = sortedMilestones.find((m) => m.monthsBefore === 12) || sortedMilestones[0]

  // Assign default items to milestones based on their position
  // Phase 1 (0-1 month): Tasks 0-3 (index 0-3)
  // Phase 2 (1-3 months): Tasks 4-7 (index 4-7)
  // Phase 3 (3-6 months): Tasks 8-11 (index 8-11)
  // Phase 4 (6-12 months): Tasks 12-15 (index 12-15)
  DEFAULT_CHECKLIST_ITEMS.forEach((item, index) => {
    let targetMilestone: TTimelineMilestone | undefined

    if (index < 4) {
      // Phase 1: First 4 tasks (0-1 month)
      targetMilestone = phase1Milestone
    } else if (index < 8) {
      // Phase 2: Next 4 tasks (1-3 months)
      targetMilestone = phase2Milestone
    } else if (index < 12) {
      // Phase 3: Next 4 tasks (3-6 months)
      targetMilestone = phase3Milestone
    } else {
      // Phase 4: Last 4 tasks (6-12 months)
      targetMilestone = phase4Milestone
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

