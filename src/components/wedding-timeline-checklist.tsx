'use client'

import { useWedding } from '@/lib/wedding-context'
import { getMilestoneProgress, getOverallProgress, getOverdueTasks, getUpcomingTasks, calculateMilestoneDates } from '@/lib/timeline-manager'
import { TTimelineMilestone, TChecklistItem, TTaskPriority } from '@/type'
import clsx from 'clsx'
import { useState, useMemo, useEffect } from 'react'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  SparklesIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import { Dialog, DialogTitle, DialogBody, DialogActions, DialogDescription } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'

interface TaskFormData {
  title: string
  description: string
  dueDate: string
  category: string
  priority: TTaskPriority
  assignedTo: string
  notes: string
}

const priorityConfig = {
  low: { 
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    ring: 'ring-blue-500/20',
  },
  medium: { 
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500', 
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    ring: 'ring-amber-500/20',
  },
  high: { 
    color: 'bg-gradient-to-r from-orange-500 to-red-500', 
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    ring: 'ring-orange-500/20',
  },
  urgent: { 
    color: 'bg-gradient-to-r from-red-500 to-pink-500', 
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    ring: 'ring-red-500/20',
  },
}

const milestoneGradients: Record<string, { from: string; via: string; to: string; dot: string }> = {
  blue: { 
    from: 'from-blue-500/20 via-blue-400/15', 
    via: 'via-blue-400/15',
    to: 'to-indigo-500/10', 
    dot: 'bg-gradient-to-br from-blue-400 to-blue-600' 
  },
  purple: { 
    from: 'from-purple-500/20 via-purple-400/15', 
    via: 'via-purple-400/15',
    to: 'to-pink-500/10', 
    dot: 'bg-gradient-to-br from-purple-400 to-purple-600' 
  },
  pink: { 
    from: 'from-pink-500/20 via-rose-400/15', 
    via: 'via-rose-400/15',
    to: 'to-fuchsia-500/10', 
    dot: 'bg-gradient-to-br from-pink-400 to-rose-600' 
  },
  orange: { 
    from: 'from-orange-500/20 via-amber-400/15', 
    via: 'via-amber-400/15',
    to: 'to-yellow-500/10', 
    dot: 'bg-gradient-to-br from-orange-400 to-orange-600' 
  },
  red: { 
    from: 'from-red-500/20 via-rose-400/15', 
    via: 'via-rose-400/15',
    to: 'to-pink-500/10', 
    dot: 'bg-gradient-to-br from-red-400 to-red-600' 
  },
}

export default function WeddingTimelineChecklist() {
  const {
    weddingInfo,
    timelineMilestones,
    checklistItems,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
  } = useWedding()

  const [editingTask, setEditingTask] = useState<TChecklistItem | null>(null)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    category: '',
    priority: 'medium',
    assignedTo: '',
    notes: '',
  })

  // Expand first milestone by default
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (timelineMilestones.length > 0) {
      return new Set([timelineMilestones[0].id])
    }
    return new Set<string>()
  })

  // Update expanded state when milestones change (if empty)
  useEffect(() => {
    if (timelineMilestones.length > 0 && expanded.size === 0) {
      setExpanded(new Set([timelineMilestones[0].id]))
    }
  }, [timelineMilestones, expanded])

  const toggleMilestone = (milestoneId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(milestoneId)) {
        next.delete(milestoneId)
      } else {
        next.add(milestoneId)
      }
      return next
    })
  }

  // Calculate milestone dates based on wedding date
  const milestonesWithDates = useMemo(() => {
    if (!weddingInfo.weddingDate) return timelineMilestones

    return timelineMilestones.map((milestone) => {
      const dates = milestone.startDate && milestone.endDate
        ? { startDate: milestone.startDate, endDate: milestone.endDate }
        : calculateMilestoneDates(milestone, weddingInfo.weddingDate!)

      return {
        ...milestone,
        startDate: dates.startDate,
        endDate: dates.endDate,
      }
    })
  }, [timelineMilestones, weddingInfo.weddingDate])

  // Group checklist items by milestone
  const itemsByMilestone = useMemo(() => {
    const grouped: Record<string, TChecklistItem[]> = {}
    milestonesWithDates.forEach((milestone) => {
      grouped[milestone.id] = checklistItems.filter((item) => item.milestoneId === milestone.id)
    })
    return grouped
  }, [checklistItems, milestonesWithDates])

  const overallProgress = getOverallProgress()
  const overdueTasks = getOverdueTasks()
  const upcomingTasks = getUpcomingTasks()

  const handleOpenTaskForm = (milestoneId: string, task?: TChecklistItem) => {
    setSelectedMilestoneId(milestoneId)
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || '',
        category: task.category || '',
        priority: task.priority,
        assignedTo: task.assignedTo || '',
        notes: task.notes || '',
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        category: '',
        priority: 'medium',
        assignedTo: '',
        notes: '',
      })
    }
    setIsTaskFormOpen(true)
  }

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      category: '',
      priority: 'medium',
      assignedTo: '',
      notes: '',
    })
  }

  const handleSubmitTask = () => {
    if (!formData.title.trim() || !selectedMilestoneId) return

    if (editingTask) {
      updateChecklistItem(editingTask.id, {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
        category: formData.category || undefined,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        notes: formData.notes || undefined,
      })
    } else {
      addChecklistItem({
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
        category: formData.category || undefined,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        notes: formData.notes || undefined,
        milestoneId: selectedMilestoneId,
        isCompleted: false,
      })
    }

    handleCloseTaskForm()
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return ''
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startFormatted} - ${endFormatted}`
  }

  const isTaskOverdue = (item: TChecklistItem) => {
    if (!item.dueDate || item.isCompleted) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(item.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const isTaskUpcoming = (item: TChecklistItem) => {
    if (!item.dueDate || item.isCompleted) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    const due = new Date(item.dueDate)
    due.setHours(0, 0, 0, 0)
    return due >= today && due <= weekFromNow
  }

  if (!weddingInfo.weddingDate) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-surface/80 to-surface/40 p-12 text-center backdrop-blur-sm shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
            <CalendarIcon className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-text">Set Your Wedding Date</h3>
          <p className="mt-3 text-sm text-text/70 max-w-md mx-auto leading-relaxed">
            Please set your wedding date to view your personalized timeline and checklist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Modern Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-surface/90 to-surface/60 p-8 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                <SparklesIcon className="h-3.5 w-3.5" />
                Wedding Planning
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Timeline & Checklist
              </h2>
              <p className="mt-2 text-base text-text/70">Track your progress and stay organized</p>
            </div>
            
            {/* Progress Circle */}
            <div className="relative">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-text/10"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - overallProgress.percentage / 100)}`}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-text">{overallProgress.percentage}%</span>
                  <span className="text-xs text-text/60">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {overdueTasks.length > 0 && (
              <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks.length}</div>
                    <div className="text-xs font-medium text-red-600/70 dark:text-red-400/70">Overdue</div>
                  </div>
                </div>
              </div>
            )}
            {upcomingTasks.length > 0 && (
              <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <ClockIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingTasks.length}</div>
                    <div className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70">Upcoming</div>
                  </div>
                </div>
              </div>
            )}
            <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{overallProgress.completed}</div>
                  <div className="text-xs font-medium text-text/70">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Timeline */}
      <div className="relative">
        {/* Desktop Vertical Timeline with Modern Design */}
        <div className="hidden lg:block">
          <div className="relative pl-12">
            {/* Animated Timeline Line with Gradient */}
            <div className="absolute left-6 top-0 bottom-0 w-1">
              <div className="h-full w-full bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 rounded-full" />
              <div 
                className="absolute top-0 w-full bg-gradient-to-b from-primary via-primary/60 to-primary/30 rounded-full transition-all duration-1000 ease-out"
                style={{ height: `${(overallProgress.percentage / 100) * 100}%` }}
              />
            </div>

            {/* Milestones */}
            <div className="space-y-10">
              {milestonesWithDates.map((milestone, index) => {
                const items = itemsByMilestone[milestone.id] || []
                const progress = getMilestoneProgress(milestone.id)
                const isExpanded = expanded.has(milestone.id)
                const colorKey = milestone.color || 'blue'
                const gradient = milestoneGradients[colorKey] || milestoneGradients.blue

                return (
                  <div key={milestone.id} className="relative">
                    {/* Animated Timeline Dot with Glow */}
                    <div className="absolute -left-[3.75rem] top-8">
                      <div className={clsx(
                        'relative h-6 w-6 rounded-full border-4 border-background shadow-2xl transition-all duration-300',
                        gradient.dot,
                        isExpanded && 'scale-125 ring-4 ring-primary/30'
                      )}>
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/40 opacity-75" />
                      </div>
                    </div>

                    {/* Milestone Card */}
                    <ModernMilestoneCard
                      milestone={milestone}
                      items={items}
                      progress={progress}
                      isExpanded={isExpanded}
                      onToggle={() => toggleMilestone(milestone.id)}
                      onAddTask={() => handleOpenTaskForm(milestone.id)}
                      onEditTask={handleOpenTaskForm}
                      onDeleteTask={deleteChecklistItem}
                      onToggleTask={toggleChecklistItem}
                      onUpdateTask={updateChecklistItem}
                      formatDateRange={formatDateRange}
                      formatDate={formatDate}
                      isTaskOverdue={isTaskOverdue}
                      isTaskUpcoming={isTaskUpcoming}
                      gradient={gradient}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Timeline */}
        <div className="lg:hidden">
          <div className="overflow-x-auto pb-6 hidden-scrollbar">
            <div className="flex gap-6 min-w-max px-4">
              {milestonesWithDates.map((milestone) => {
                const items = itemsByMilestone[milestone.id] || []
                const progress = getMilestoneProgress(milestone.id)
                const isExpanded = expanded.has(milestone.id)
                const colorKey = milestone.color || 'blue'
                const gradient = milestoneGradients[colorKey] || milestoneGradients.blue

                return (
                  <div key={milestone.id} className="w-96 flex-shrink-0">
                    <ModernMilestoneCard
                      milestone={milestone}
                      items={items}
                      progress={progress}
                      isExpanded={isExpanded}
                      onToggle={() => toggleMilestone(milestone.id)}
                      onAddTask={() => handleOpenTaskForm(milestone.id)}
                      onEditTask={handleOpenTaskForm}
                      onDeleteTask={deleteChecklistItem}
                      onToggleTask={toggleChecklistItem}
                      onUpdateTask={updateChecklistItem}
                      formatDateRange={formatDateRange}
                      formatDate={formatDate}
                      isTaskOverdue={isTaskOverdue}
                      isTaskUpcoming={isTaskUpcoming}
                      gradient={gradient}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      <Dialog open={isTaskFormOpen} onClose={handleCloseTaskForm} size="md">
        <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogDescription>
          {editingTask ? 'Update task details below' : 'Fill in the details for your new task'}
        </DialogDescription>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                Task Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Book photographer"
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
                className="w-full"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TTaskPriority })}
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Category
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Venue, Photography"
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Assigned To
                </label>
                <Input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Optional"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
                className="w-full"
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button outline onClick={handleCloseTaskForm}>
            Cancel
          </Button>
          <Button
            color="dark/zinc"
            onClick={handleSubmitTask}
            disabled={!formData.title.trim()}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

interface ModernMilestoneCardProps {
  milestone: TTimelineMilestone & { startDate?: string; endDate?: string }
  items: TChecklistItem[]
  progress: { total: number; completed: number; percentage: number }
  isExpanded: boolean
  onToggle: () => void
  onAddTask: () => void
  onEditTask: (milestoneId: string, task: TChecklistItem) => void
  onDeleteTask: (itemId: string) => void
  onToggleTask: (itemId: string) => void
  onUpdateTask: (itemId: string, updates: Partial<Omit<TChecklistItem, 'id'>>) => void
  formatDateRange: (startDate?: string, endDate?: string) => string
  formatDate: (dateStr: string) => string
  isTaskOverdue: (item: TChecklistItem) => boolean
  isTaskUpcoming: (item: TChecklistItem) => boolean
  gradient: { from: string; via: string; to: string; dot: string }
}

function ModernMilestoneCard({
  milestone,
  items,
  progress,
  isExpanded,
  onToggle,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onUpdateTask,
  formatDateRange,
  formatDate,
  isTaskOverdue,
  isTaskUpcoming,
  gradient,
}: ModernMilestoneCardProps) {
  const dateRange = formatDateRange(milestone.startDate, milestone.endDate)
  const sortedItems = [...items].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br backdrop-blur-sm shadow-xl transition-all duration-500',
        gradient.from,
        gradient.to,
        isExpanded ? 'shadow-2xl scale-[1.02]' : 'hover:shadow-2xl hover:scale-[1.01]'
      )}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text/70 backdrop-blur-sm">
              {milestone.title.split(' ')[0]} Phase
            </div>
            <h3 className="text-2xl font-bold text-text">{milestone.title}</h3>
            {milestone.description && (
              <p className="mt-2 text-sm leading-relaxed text-text/70">{milestone.description}</p>
            )}
            {dateRange && (
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <span>{dateRange}</span>
              </div>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={clsx(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm transition-all duration-300',
              isExpanded 
                ? 'rotate-180 bg-primary/20 text-primary' 
                : 'hover:bg-background/80 text-text/60 hover:text-text'
            )}
          >
            <ChevronDownIcon className="h-6 w-6 transition-transform" />
          </button>
        </div>

        {/* Modern Progress Indicator */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-text">
              {progress.completed} / {progress.total} Tasks
            </span>
            <span className="text-lg font-bold text-text">{progress.percentage}%</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-background/40 backdrop-blur-sm shadow-inner">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-1000 ease-out shadow-lg',
                progress.percentage === 100 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-primary via-primary/90 to-primary/80'
              )}
              style={{ width: `${progress.percentage}%` }}
            >
              {progress.percentage > 0 && (
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />
              )}
            </div>
          </div>
        </div>

        {/* Checklist Items with Smooth Animation */}
        {isExpanded && (
          <div className="mt-8 space-y-3 transition-all duration-500 ease-out">
            {sortedItems.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-background/40 p-8 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <FunnelIcon className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-sm font-medium text-text/60">No tasks yet</p>
                <p className="mt-1 text-xs text-text/40">Click below to add your first task</p>
              </div>
            ) : (
              sortedItems.map((item) => (
                <ModernChecklistItem
                  key={item.id}
                  item={item}
                  onToggle={() => onToggleTask(item.id)}
                  onEdit={() => onEditTask(milestone.id, item)}
                  onDelete={() => onDeleteTask(item.id)}
                  formatDate={formatDate}
                  isOverdue={isTaskOverdue(item)}
                  isUpcoming={isTaskUpcoming(item)}
                />
              ))
            )}

            {/* Add Task Button with Gradient */}
            <button
              onClick={onAddTask}
              className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 text-sm font-semibold text-text transition-all hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <PlusIcon className="h-5 w-5 text-primary" />
              <span className="text-primary">Add New Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ModernChecklistItemProps {
  item: TChecklistItem
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  formatDate: (dateStr: string) => string
  isOverdue: boolean
  isUpcoming: boolean
}

function ModernChecklistItem({
  item,
  onToggle,
  onEdit,
  onDelete,
  formatDate,
  isOverdue,
  isUpcoming,
}: ModernChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const priority = priorityConfig[item.priority]

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background/80 to-background/40 p-5 shadow-md backdrop-blur-sm transition-all duration-300',
        item.isCompleted 
          ? 'border-green-500/30 opacity-75' 
          : isOverdue 
            ? 'border-red-500/30 bg-red-500/5' 
            : 'border-primary/10 hover:border-primary/30 hover:shadow-xl hover:scale-[1.01]'
      )}
    >
      {/* Priority Indicator Bar */}
      {!item.isCompleted && (
        <div className={clsx('absolute left-0 top-0 bottom-0 w-1.5', priority.color)} />
      )}
      
      {/* Completion Glow */}
      {item.isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Modern Checkbox */}
        <button
          onClick={onToggle}
          className={clsx(
            'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 shadow-sm',
            item.isCompleted
              ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
              : 'border-text/30 bg-background hover:border-primary hover:scale-110 hover:shadow-md'
          )}
        >
          {item.isCompleted && <CheckCircleIconSolid className="h-4 w-4" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4
                className={clsx(
                  'text-base font-semibold leading-snug transition-all',
                  item.isCompleted 
                    ? 'line-through text-text/40' 
                    : 'text-text'
                )}
              >
                {item.title}
              </h4>
              {item.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-text/60 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <button
                onClick={onEdit}
                className="rounded-lg p-2 text-text/50 transition-all hover:bg-primary/10 hover:text-primary hover:scale-110"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg p-2 text-text/50 transition-all hover:bg-red-500/10 hover:text-red-600 hover:scale-110"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Metadata Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.dueDate && (
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm',
                  isOverdue
                    ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
                    : isUpcoming
                      ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      : 'bg-text/10 text-text/70 border border-text/20'
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDate(item.dueDate)}
              </span>
            )}

            <span
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm border',
                priority.bg,
                priority.text,
                priority.ring
              )}
            >
              <div className={clsx('h-2 w-2 rounded-full', priority.color)} />
              {item.priority}
            </span>

            {item.category && (
              <span className="rounded-xl bg-text/10 border border-text/20 px-3 py-1.5 text-xs font-medium text-text/70 backdrop-blur-sm">
                {item.category}
              </span>
            )}

            {item.assignedTo && (
              <span className="rounded-xl bg-text/10 border border-text/20 px-3 py-1.5 text-xs font-medium text-text/70 backdrop-blur-sm">
                👤 {item.assignedTo}
              </span>
            )}
          </div>

          {/* Notes Section */}
          {item.notes && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? '▼ Hide notes' : '▶ Show notes'}
              </button>
              {isExpanded && (
                <div className="mt-2 rounded-xl bg-text/5 border border-text/10 p-3 text-xs leading-relaxed text-text/70 backdrop-blur-sm">
                  {item.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
