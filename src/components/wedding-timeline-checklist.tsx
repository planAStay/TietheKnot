'use client'

import { useWedding } from '@/lib/wedding-context'
import { getMilestoneProgress, getOverallProgress, calculateMilestoneDates } from '@/lib/timeline-manager'
import { getBudgetSummary, formatCurrency } from '@/lib/budget-manager'
import { getAllVendors, getVendorCategories } from '@/data-wedding'
import { TTimelineMilestone, TChecklistItem } from '@/type'
import clsx from 'clsx'
import { useState, useMemo, useEffect } from 'react'
import {
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  HomeIcon,
  PaintBrushIcon,
  UserGroupIcon,
  BanknotesIcon,
  CameraIcon,
  EnvelopeIcon,
  HeartIcon,
  ArrowRightIcon,
  ChartPieIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Dialog, DialogTitle, DialogBody, DialogActions, DialogDescription } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import Image from 'next/image'
import Link from 'next/link'

interface TaskFormData {
  title: string
  description: string
  dueDate: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  notes: string
}

// Map task categories to icons and related vendor categories with smart sub-task suggestions
const getTaskCategoryConfig = () => ({
  'Venue': {
    icon: <HomeIcon className="h-6 w-6" />,
    vendorCategory: 'venues',
    getSubTasks: () => ['Research venues in your area', 'Visit top 3 venues', 'Compare packages and pricing', 'Book your venue']
  },
  'Budget': {
    icon: <BanknotesIcon className="h-6 w-6" />,
    getSubTasks: () => ['Research average costs', 'Decide which vendors you\'ll need', 'Set your goal budget']
  },
  'Vibe': {
    icon: <PaintBrushIcon className="h-6 w-6" />,
    getSubTasks: () => ['Define your wedding style', 'Choose color palette', 'Select theme inspiration', 'Create mood board']
  },
  'Guest List': {
    icon: <UserGroupIcon className="h-6 w-6" />,
    getSubTasks: () => ['Create initial guest list', 'Collect addresses', 'Organize by category (family, friends, etc.)', 'Send save-the-dates']
  },
  'Photography': {
    icon: <CameraIcon className="h-6 w-6" />,
    vendorCategory: 'photography-and-videography',
    getSubTasks: () => ['Research photographers', 'View portfolios', 'Book photographer and videographer', 'Schedule engagement shoot']
  },
  'Invitations': {
    icon: <EnvelopeIcon className="h-6 w-6" />,
    vendorCategory: 'stationery-and-invitations',
    getSubTasks: () => ['Design invitations', 'Order samples', 'Finalize and order', 'Mail invitations']
  },
})

// Get default sub-tasks based on task category or title
function getSubTasksForTask(task: TChecklistItem): string[] {
  const categoryMap = getTaskCategoryConfig()
  const category = task.category || task.title
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || task.title.toLowerCase().includes(key.toLowerCase())) {
      return value.getSubTasks()
    }
  }
  // Default sub-tasks
  return ['Research options', 'Compare vendors', 'Make final decision', 'Follow up']
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
    budgetCategories,
    budgetExpenses,
    shortlistedVendors,
    shortlist,
    toggleShortlist,
  } = useWedding()

  const [selectedTask, setSelectedTask] = useState<TChecklistItem | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null) // Track selected phase (1-4)
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

  const allVendors = getAllVendors()
  const categories = getVendorCategories()
  const totalBudget = weddingInfo.totalBudget || 0
  const budgetSummary = getBudgetSummary(budgetCategories, totalBudget)

  // Calculate milestone dates and map to 4-phase structure
  const milestonesWithDates = useMemo(() => {
    if (!weddingInfo.weddingDate) return timelineMilestones.slice(0, 4)

    const withDates = timelineMilestones.map((milestone) => {
      const dates = milestone.startDate && milestone.endDate
        ? { startDate: milestone.startDate, endDate: milestone.endDate }
        : calculateMilestoneDates(milestone, weddingInfo.weddingDate!)

      return {
        ...milestone,
        startDate: dates.startDate,
        endDate: dates.endDate,
      }
    })

    // Find milestones that match our 4-phase structure
    // Phase 1 (0-1 month): monthsBefore: 1 (has 5 tasks)
    // Phase 2 (1-3 months): monthsBefore: 3 (has 6 tasks) - "3-1 Months Before"
    // Phase 3 (3-6 months): monthsBefore: 6 (has 6 tasks) - "6-3 Months Before"
    // Phase 4 (6-12 months): monthsBefore: 12 (has 6 tasks) - "12-6 Months Before"
    
    const phase1 = withDates.find(m => (m.monthsBefore || 0) === 1)
      || withDates.find(m => (m.monthsBefore || 0) >= 0.25 && (m.monthsBefore || 0) < 1)
      || withDates[3] || withDates[0]
    
    const phase2 = withDates.find(m => (m.monthsBefore || 0) === 3)
      || withDates.find(m => (m.monthsBefore || 0) >= 1 && (m.monthsBefore || 0) < 3 && (m.monthsBefore || 0) !== 1)
      || withDates[2] || withDates[1] || withDates[0]
    
    const phase3 = withDates.find(m => (m.monthsBefore || 0) === 6)
      || withDates.find(m => (m.monthsBefore || 0) >= 3 && (m.monthsBefore || 0) < 6 && (m.monthsBefore || 0) !== 3)
      || withDates[1] || withDates[2] || withDates[0]
    
    const phase4 = withDates.find(m => (m.monthsBefore || 0) === 12)
      || withDates.find(m => (m.monthsBefore || 0) >= 6 && (m.monthsBefore || 0) <= 12 && (m.monthsBefore || 0) !== 6)
      || withDates[0] || withDates[1] || withDates[2] || withDates[3]
    
    // Return in display order: [phase1 (0-1mo), phase2 (1-3mo), phase3 (3-6mo), phase4 (6-12mo)]
    const mapped = [phase1, phase2, phase3, phase4].filter((m): m is typeof phase1 => m !== undefined)
    return mapped.length === 4 ? mapped : withDates.slice(0, 4)
  }, [timelineMilestones, weddingInfo.weddingDate])

  // Get all tasks sorted by milestone
  const tasksByPhase = useMemo(() => {
    const grouped: Record<number, TChecklistItem[]> = {}
    milestonesWithDates.forEach((milestone, index) => {
      const phaseNum = index + 1
      grouped[phaseNum] = checklistItems.filter((item) => item.milestoneId === milestone.id)
    })
    return grouped
  }, [checklistItems, milestonesWithDates])

  // Get filtered tasks based on selected phase
  const filteredTasks = useMemo(() => {
    if (selectedPhase === null) {
      // If no phase selected, default to the first phase with tasks or first phase
      const firstPhaseWithTasks = Object.keys(tasksByPhase).find(phase => tasksByPhase[Number(phase)].length > 0)
      const defaultPhase = firstPhaseWithTasks ? Number(firstPhaseWithTasks) : 1
      return tasksByPhase[defaultPhase] || []
    }
    return tasksByPhase[selectedPhase] || []
  }, [selectedPhase, tasksByPhase])

  // Auto-select first phase on mount or when tasks change
  useEffect(() => {
    if (selectedPhase === null && Object.keys(tasksByPhase).length > 0) {
      const firstPhaseWithTasks = Object.keys(tasksByPhase).find(phase => tasksByPhase[Number(phase)].length > 0)
      if (firstPhaseWithTasks) {
        setSelectedPhase(Number(firstPhaseWithTasks))
      } else {
        setSelectedPhase(1)
      }
    }
  }, [selectedPhase, tasksByPhase])

  const overallProgress = getOverallProgress()

  // Auto-select first task from filtered tasks when phase changes
  useEffect(() => {
    if (selectedPhase !== null && filteredTasks.length > 0) {
      // If current selected task is not in filtered tasks, select first from filtered
      const currentSelectedTaskId = selectedTask?.id
      const isTaskInFiltered = currentSelectedTaskId ? filteredTasks.some(item => item.id === currentSelectedTaskId) : false
      if (!isTaskInFiltered || !selectedTask) {
        const firstIncomplete = filteredTasks.find(item => !item.isCompleted) || filteredTasks[0]
        if (firstIncomplete) {
          setSelectedTask(firstIncomplete)
        }
      }
    } else if (selectedPhase !== null && filteredTasks.length === 0) {
      // No tasks in selected phase, clear selection
      setSelectedTask(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhase, filteredTasks.length]) // Only depend on phase and task count changes

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

  // Get relevant vendors for selected task
  const getRelevantVendors = () => {
    if (!selectedTask) return []
    
    const categoryMap = getTaskCategoryConfig()
    const category = selectedTask.category || selectedTask.title
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.toLowerCase().includes(key.toLowerCase()) || selectedTask.title.toLowerCase().includes(key.toLowerCase())) {
        if ('vendorCategory' in value && value.vendorCategory) {
          return allVendors
            .filter(v => v.category === value.vendorCategory || v.category.includes(value.vendorCategory))
            .slice(0, 4)
        }
      }
    }
    // Return featured vendors as fallback
    return allVendors.filter(v => v.featured).slice(0, 4)
  }

  // Get icon for task
  const getTaskIcon = (task: TChecklistItem) => {
    const categoryMap = getTaskCategoryConfig()
    const category = task.category || task.title
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.toLowerCase().includes(key.toLowerCase()) || task.title.toLowerCase().includes(key.toLowerCase())) {
        return value.icon
      }
    }
    return <SparklesIcon className="h-6 w-6" />
  }

  // Calculate average cost estimate based on budget
  const getAverageCostEstimate = () => {
    if (totalBudget > 0) {
      return totalBudget
    }
    // Default estimate if no budget set
    return 30000
  }

  // Get phase number for a milestone
  const getPhaseNumber = (milestoneId: string): number => {
    const index = milestonesWithDates.findIndex(m => m.id === milestoneId)
    return index + 1
  }

  // Format phase time range - simplified to match design
  const formatPhaseTime = (milestone: TTimelineMilestone & { startDate?: string; endDate?: string }, index: number) => {
    // Simple mapping based on position - matching the image design
    const timeLabels = ['0-1 month', '1-3 months', '3-6 months', '6-12 months']
    if (index < timeLabels.length) {
      return timeLabels[index]
    }
    
    // Fallback to calculated
    if (!milestone.startDate || !milestone.endDate) {
      const months = milestone.monthsBefore || 0
      if (months >= 12) return '12+ months'
      if (months >= 6) return '6-12 months'
      if (months >= 3) return '3-6 months'
      if (months >= 1) return '1-3 months'
      return '0-1 month'
    }
    
    const end = new Date(milestone.endDate)
    const weddingDate = weddingInfo.weddingDate ? new Date(weddingInfo.weddingDate) : null
    
    if (weddingDate) {
      const monthsBefore = Math.round((weddingDate.getTime() - end.getTime()) / (1000 * 60 * 60 * 24 * 30))
      if (monthsBefore >= 12) return '12+ months'
      if (monthsBefore >= 6) return '6-12 months'
      if (monthsBefore >= 3) return '3-6 months'
      if (monthsBefore >= 1) return '1-3 months'
      return '0-1 month'
    }
    
    return 'Planning phase'
  }

  if (!weddingInfo.weddingDate) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-surface/80 to-surface/40 p-12 text-center backdrop-blur-sm shadow-2xl">
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
    <div className="grid lg:grid-cols-[420px_1fr] gap-0 min-h-[600px] rounded-3xl border border-primary/10 bg-surface overflow-hidden shadow-2xl">
      {/* Left Panel: Wedding Plan Overview */}
      <div className="bg-gradient-to-b from-[#f5f3f0] to-[#faf8f5] dark:from-surface dark:to-surface/95 border-r border-primary/10 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text mb-1">Your wedding plan</h2>
          <div className="flex items-center gap-2 text-sm text-text/60">
            {selectedPhase !== null ? (
              <>
                <span className="font-semibold text-text">
                  {filteredTasks.filter(t => t.isCompleted).length}/{filteredTasks.length}
                </span>
                <span>tasks completed</span>
                <span className="text-text/40">•</span>
                <span className="text-text/50">Phase {selectedPhase}</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-text">{overallProgress.completed}/{overallProgress.total}</span>
                <span>tasks completed</span>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="mb-8">
          <div className="relative flex items-start justify-between">
            {/* Background connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gradient-to-r from-text/10 via-text/10 to-text/10 z-0" />
            
            {milestonesWithDates.slice(0, 4).map((milestone, index) => {
              const phaseNum = index + 1
              const phaseTasks = tasksByPhase[phaseNum] || []
              const phaseProgress = getMilestoneProgress(milestone.id)
              const isSelected = selectedPhase === phaseNum
              const taskCount = phaseTasks.length
              
              return (
                <button
                  key={milestone.id}
                  onClick={() => {
                    setSelectedPhase(phaseNum)
                    // Auto-select first task from this phase
                    if (phaseTasks.length > 0) {
                      const firstIncomplete = phaseTasks.find(item => !item.isCompleted) || phaseTasks[0]
                      setSelectedTask(firstIncomplete)
                    } else {
                      setSelectedTask(null)
                    }
                  }}
                  className="flex-1 flex flex-col items-center relative cursor-pointer group z-10"
                  type="button"
                >
                  {/* Phase Number Circle */}
                  <div
                    className={clsx(
                      'relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-base transition-all duration-300 shadow-sm',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 shadow-lg shadow-blue-600/40 scale-110'
                        : phaseProgress.percentage === 100
                          ? 'border-green-500 bg-green-500 shadow-lg group-hover:scale-105'
                          : 'border-text/20 bg-white dark:bg-background hover:border-blue-500/50 hover:scale-105'
                    )}
                    style={isSelected ? {} : {}}
                  >
                    {phaseProgress.percentage === 100 ? (
                      <CheckCircleIconSolid className="h-6 w-6 text-white" />
                    ) : (
                      <span className={clsx(
                        'font-bold',
                        isSelected ? 'text-white' : 'text-text/70'
                      )}>
                        {phaseNum}
                      </span>
                    )}
                  </div>
                  
                  {/* Phase Label */}
                  <div className="mt-3 text-center min-h-[40px]">
                    <div className={clsx(
                      "text-xs font-medium transition-colors",
                      isSelected ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-text/70"
                    )}>
                      {formatPhaseTime(milestone, index)}
                    </div>
                    {taskCount > 0 && (
                      <div className={clsx(
                        "text-xs mt-1 transition-colors",
                        isSelected ? "text-blue-600/80 dark:text-blue-400/80" : "text-text/50"
                      )}>
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Task List - Filtered by Selected Phase */}
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto hidden-scrollbar px-1">
          <div className="space-y-3 py-1">
            {filteredTasks.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-background/30 p-8 text-center">
                  <p className="text-sm text-text/60 mb-4">
                    {selectedPhase !== null 
                      ? `No tasks for phase ${selectedPhase} yet`
                      : 'No tasks yet'}
                  </p>
                  <button
                    onClick={() => {
                      if (timelineMilestones.length > 0 && selectedPhase !== null) {
                        const milestoneIndex = selectedPhase - 1
                        const milestone = timelineMilestones[milestoneIndex] || timelineMilestones[0]
                        handleOpenTaskForm(milestone.id)
                      } else if (timelineMilestones.length > 0) {
                        handleOpenTaskForm(timelineMilestones[0].id)
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white hover:from-pink-600 hover:to-rose-600 transition shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Task to This Phase
                  </button>
                </div>
                
                {/* Secondary Add Task Button */}
                <button
                  onClick={() => {
                    if (timelineMilestones.length > 0 && selectedPhase !== null) {
                      const milestoneIndex = selectedPhase - 1
                      const milestone = timelineMilestones[milestoneIndex] || timelineMilestones[0]
                      handleOpenTaskForm(milestone.id)
                    } else if (timelineMilestones.length > 0) {
                      handleOpenTaskForm(timelineMilestones[0].id)
                    }
                  }}
                  className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-background/30 px-4 py-3 text-sm font-medium text-text/60 transition hover:border-primary/50 hover:bg-background/50 hover:text-text flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Task{selectedPhase !== null ? ` to Phase ${selectedPhase}` : ''}
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id
                const taskIcon = getTaskIcon(task)
                
                return (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task)
                      // Switch to the phase that contains this task
                      const taskPhase = milestonesWithDates.findIndex(m => m.id === task.milestoneId) + 1
                      if (taskPhase > 0 && taskPhase !== selectedPhase) {
                        setSelectedPhase(taskPhase)
                      }
                    }}
                    className={clsx(
                      'group w-full text-left rounded-2xl border-2 p-4 transition-all duration-300 bg-white dark:bg-background/50 shadow-sm',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg shadow-blue-500/20 scale-[1.02]'
                        : 'border-text/10 hover:border-blue-300 hover:shadow-md hover:shadow-blue-200/30',
                      task.isCompleted && 'opacity-70'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <div
                        className={clsx(
                          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all cursor-pointer shadow-sm',
                          task.isCompleted
                            ? 'border-green-500 bg-green-500 text-white shadow-green-500/30'
                            : 'border-text/30 bg-white dark:bg-background group-hover:border-green-500 group-hover:shadow-md'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleChecklistItem(task.id)
                        }}
                      >
                        {task.isCompleted && <CheckCircleIconSolid className="h-4 w-4" />}
                      </div>
                      
                      {/* Icon */}
                      <div className={clsx(
                        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 shadow-sm',
                        isSelected 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-blue-200/50' 
                          : 'bg-white dark:bg-background/80 text-text/70 dark:text-text/60 border border-text/10 group-hover:shadow-md'
                      )}>
                        {taskIcon}
                      </div>
                      
                      {/* Task Title */}
                      <div className="flex-1 min-w-0">
                        <h4 className={clsx(
                          'text-base font-medium leading-snug',
                          task.isCompleted ? 'line-through text-text/50' : 'text-text'
                        )}>
                          {task.title}
                        </h4>
                      </div>
                      
                      {/* Arrow for selected */}
                      {isSelected && (
                        <ArrowRightIcon className="h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400 ml-2 transition-transform group-hover:translate-x-1" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Add Task Button - Only show when there are tasks */}
        {filteredTasks.length > 0 && (
          <button
            onClick={() => {
              if (timelineMilestones.length > 0 && selectedPhase !== null) {
                const milestoneIndex = selectedPhase - 1
                const milestone = timelineMilestones[milestoneIndex] || timelineMilestones[0]
                handleOpenTaskForm(milestone.id)
              } else if (timelineMilestones.length > 0) {
                handleOpenTaskForm(timelineMilestones[0].id)
              }
            }}
            className="mt-4 w-full rounded-xl border-2 border-dashed border-primary/30 bg-background/30 px-4 py-3 text-sm font-medium text-text/60 transition hover:border-primary/50 hover:bg-background/50 hover:text-text flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Task{selectedPhase !== null ? ` to Phase ${selectedPhase}` : ''}
          </button>
        )}
      </div>

      {/* Right Panel: Task Details */}
      <div className="bg-gradient-to-b from-[#f0f2f5] to-[#f5f7fa] dark:from-background/90 dark:to-background/70 p-6 lg:p-8 overflow-y-auto">
        {selectedTask ? (
          <TaskDetailView
            task={selectedTask}
            onToggle={() => toggleChecklistItem(selectedTask.id)}
            onEdit={() => {
              const milestone = milestonesWithDates.find(m => m.id === selectedTask.milestoneId)
              if (milestone) {
                handleOpenTaskForm(milestone.id, selectedTask)
              }
            }}
            onDelete={() => deleteChecklistItem(selectedTask.id)}
            getSubTasks={getSubTasksForTask}
            relevantVendors={getRelevantVendors()}
            averageCost={getAverageCostEstimate()}
            budgetSummary={budgetSummary}
            totalBudget={totalBudget}
            location={weddingInfo.location}
            shortlistedVendors={shortlistedVendors}
            shortlist={shortlist}
            onToggleShortlist={toggleShortlist}
          />
        ) : (
          <div className="flex h-full min-h-[400px] items-center justify-center text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-text/5 to-text/10">
                <SparklesIcon className="h-10 w-10 text-text/30" />
              </div>
              <h3 className="text-2xl font-semibold text-text/80 mb-3">Select a task</h3>
              <p className="text-sm text-text/60 leading-relaxed max-w-sm mx-auto">
                Click on a task from the left panel to view details, sub-tasks, and helpful resources.
              </p>
            </div>
          </div>
        )}
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
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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

interface TaskDetailViewProps {
  task: TChecklistItem
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  getSubTasks: (task: TChecklistItem) => string[]
  relevantVendors: any[]
  averageCost: number
  budgetSummary: ReturnType<typeof getBudgetSummary>
  totalBudget: number
  location?: string
  shortlistedVendors: any[]
  shortlist: any[]
  onToggleShortlist: (vendorProfileId: number) => Promise<void>
}

function TaskDetailView({
  task,
  onToggle,
  onEdit,
  onDelete,
  getSubTasks,
  relevantVendors,
  averageCost,
  budgetSummary,
  totalBudget,
  location,
  shortlistedVendors,
  shortlist,
  onToggleShortlist,
}: TaskDetailViewProps) {
  const subTasks = getSubTasks(task)
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVendorForBooking, setSelectedVendorForBooking] = useState<any>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  
  const allVendors = getAllVendors()
  
  // Filter vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) {
      return allVendors.slice(0, 8) // Show first 8 vendors when no search
    }
    const query = searchQuery.toLowerCase()
    return allVendors.filter(vendor => 
      vendor.name.toLowerCase().includes(query) ||
      vendor.category.toLowerCase().includes(query) ||
      vendor.subcategory.toLowerCase().includes(query) ||
      vendor.location.toLowerCase().includes(query) ||
      vendor.tags?.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 8)
  }, [searchQuery, allVendors])
  
  const handleOpenBookingPopup = () => {
    setIsBookingPopupOpen(true)
    setSearchQuery('')
    setSelectedVendorForBooking(null)
    setBookingSuccess(false)
  }
  
  const handleCloseBookingPopup = () => {
    setIsBookingPopupOpen(false)
    setSearchQuery('')
    setSelectedVendorForBooking(null)
    setBookingSuccess(false)
  }
  
  const handleSelectVendor = (vendor: any) => {
    setSelectedVendorForBooking(vendor)
  }
  
  const handleSaveVendor = async () => {
    if (!selectedVendorForBooking) return
    
    try {
      // Try to extract vendor profile ID from handle or ID
      // Handle format for real vendors: category-businessname-id (e.g., "venues-wedding-venues-123")
      // Handle format for mock vendors: category-subcategory-number (e.g., "venues-wedding-venues-1")
      let vendorProfileId: number
      
      // Try to extract from handle (look for number at the end)
      const idMatch = selectedVendorForBooking.handle.match(/-(\d+)$/)
      if (idMatch) {
        vendorProfileId = parseInt(idMatch[1], 10)
      } else {
        // Try to parse from ID field
        const idFromId = parseInt(selectedVendorForBooking.id, 10)
        if (!isNaN(idFromId)) {
          vendorProfileId = idFromId
        } else {
          // Fallback: use 1 for mock vendors (this will fail gracefully if vendor doesn't exist)
          vendorProfileId = 1
        }
      }
      
      await onToggleShortlist(vendorProfileId)
      setBookingSuccess(true)
      
      // Close popup after 1.5 seconds
      setTimeout(() => {
        handleCloseBookingPopup()
      }, 1500)
    } catch (error) {
      console.error('Error saving vendor:', error)
      // Show error message to user
      alert('Unable to save vendor. Please try again or contact support.')
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* Task Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-primary/5 dark:from-background/80 dark:via-background/80 dark:to-primary/10 p-6 shadow-sm border border-primary/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-text mb-4 bg-gradient-to-r from-text to-text/80 bg-clip-text">{task.title}</h2>
            
            {/* Mark Goal as Done */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={onToggle}
                className="sr-only"
              />
              <div
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all flex-shrink-0 shadow-sm',
                  task.isCompleted
                    ? 'border-green-500 bg-green-500 text-white shadow-green-500/30'
                    : 'border-text/30 bg-white dark:bg-background group-hover:border-green-500 group-hover:shadow-md'
                )}
              >
                {task.isCompleted && <CheckCircleIconSolid className="h-4 w-4" />}
              </div>
              <span className={clsx(
                'text-sm font-medium select-none transition-colors',
                task.isCompleted ? 'text-green-700 dark:text-green-400' : 'text-text/70 group-hover:text-text'
              )}>
                Mark goal as done
              </span>
            </label>
          </div>
        </div>

      {/* Things To Do Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-background/40 backdrop-blur-sm p-6 border border-primary/10 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text/60 mb-6 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-primary/60" />
          THINGS TO DO
        </h3>
        <ul className="space-y-3">
          {subTasks.map((subTask, index) => (
            <li key={index} className="list-none">
              <div className="text-base leading-relaxed text-text pl-2">
                {subTask}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Book Vendor Card */}
      <button
        onClick={handleOpenBookingPopup}
        className="group w-full rounded-2xl border-2 border-primary/20 bg-white dark:bg-background/80 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          {/* Icon Section */}
          <div className="relative flex-shrink-0">
            {/* Building/Storefront Icon */}
            <div className="relative h-14 w-14 flex items-center justify-center">
              {/* Yellow building base */}
              <div className="absolute inset-0 bg-accent/30 rounded-lg" />
              {/* Building icon */}
              <BuildingStorefrontIcon className="relative h-8 w-8 text-accent" />
              {/* Pink starburst with checkmark overlay */}
              <div className="absolute -right-1 -top-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <CheckCircleIconSolid className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Text Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-base text-text">Book vendor</span>
              <ArrowRightIcon className="h-5 w-5 text-text/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-text/70 leading-relaxed">
              Track and organize your booking progress.
            </p>
          </div>
        </div>
      </button>

      {/* Cost Estimates Card - Show for budget-related tasks */}
      {(task.category?.toLowerCase().includes('budget') || task.title.toLowerCase().includes('budget')) && (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-background/50 p-6 transition-all hover:shadow-lg cursor-pointer">
          <Link href="/my-wedding/budget" className="block">
            <div className="flex items-start gap-4">
              {/* Donut Chart Icon */}
              <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-primary/30" />
                <div className="absolute inset-2 rounded-full border-4 border-primary" style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 60%)' 
                }} />
                <ChartPieIcon className="relative h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-text">See estimates</h4>
                  <ArrowRightIcon className="h-5 w-5 text-primary transition group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-text/80 leading-relaxed">
                  Average wedding cost{location ? ` in ${location}` : ''}: <span className="font-bold text-lg text-text">{formatCurrency(averageCost)}</span>
                </p>
                {totalBudget > 0 && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-text/60">
                    <span>Your budget: <span className="font-semibold">{formatCurrency(totalBudget)}</span></span>
                    <span>•</span>
                    <span>Spent: <span className="font-semibold">{formatCurrency(budgetSummary.totalSpent)}</span></span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Ideas & Advice Section */}
      {relevantVendors.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-primary/5 dark:from-background/60 dark:via-background/60 dark:to-primary/10 p-6 border border-primary/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text/60 flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-primary/60" />
              IDEAS & ADVICE
            </h3>
          </div>
          <div className="relative">
            <div className="flex gap-5 overflow-x-auto pb-4 hidden-scrollbar snap-x snap-mandatory scroll-px-4">
              {relevantVendors.map((vendor, index) => {
                const isShortlisted = shortlist.some(item => item.vendorHandle === vendor.handle)
                
                return (
                  <div
                    key={vendor.id}
                    className="group relative flex-shrink-0 w-80 snap-start rounded-2xl border-2 border-text/10 bg-white dark:bg-background/90 overflow-hidden transition-all hover:shadow-2xl hover:border-primary/40 hover:scale-[1.03] shadow-lg"
                  >
                    {/* Image with Overlay */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={vendor.heroImage.src}
                        alt={vendor.heroImage.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-115"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          try {
                            // Extract vendor profile ID from handle
                            const idMatch = vendor.handle.match(/-(\d+)$/)
                            const vendorProfileId = idMatch ? parseInt(idMatch[1], 10) : parseInt(vendor.id, 10) || 1
                            await onToggleShortlist(vendorProfileId)
                          } catch (error) {
                            console.error('Error toggling shortlist:', error)
                          }
                        }}
                        className="absolute top-3 right-3 z-10 rounded-full p-2.5 bg-white/95 dark:bg-background/95 backdrop-blur-sm hover:bg-white dark:hover:bg-background transition shadow-lg hover:scale-110"
                      >
                        {isShortlisted ? (
                          <HeartIconSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-text/60 hover:text-red-500 transition" />
                        )}
                      </button>
                      
                      {/* Book Vendor Button Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleOpenBookingPopup()
                          }}
                          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-lg hover:shadow-xl backdrop-blur-sm"
                        >
                          Book Vendor
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 bg-white dark:bg-background/90">
                      <Link
                        href={`/products/${vendor.handle}`}
                        className="block"
                      >
                        <h4 className="font-bold text-lg text-text line-clamp-2 mb-2 group-hover:text-primary transition leading-tight">
                          {vendor.name}
                        </h4>
                        <p className="text-xs text-text/60 uppercase tracking-wide mb-3 font-semibold">{vendor.category}</p>
                        {vendor.rating && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="text-amber-500 font-bold text-base">★</span>
                            <span className="font-semibold text-text/80">{vendor.rating}</span>
                            <span className="text-text/40">•</span>
                            <span className="text-text/60">{vendor.location}</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  </div>
                )
              })}
              
              {/* Scroll Indicator (if there are more items) */}
              {relevantVendors.length > 3 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-l from-background/95 to-transparent">
                    <ArrowRightIcon className="h-7 w-7 text-text/40" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - Subtle at bottom */}
      {task.dueDate && (
        <div className="pt-6 border-t border-text/10">
          <div className="flex items-center gap-2 text-sm text-text/60">
            <CalendarIcon className="h-4 w-4" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      )}
    </div>

    {/* Vendor Booking Popup */}
    <Dialog open={isBookingPopupOpen} onClose={handleCloseBookingPopup} size="lg">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={handleCloseBookingPopup}
          className="absolute -top-2 -right-2 z-10 rounded-full p-2 bg-white dark:bg-background border-2 border-text/20 hover:border-text/40 transition shadow-lg hover:scale-110"
        >
          <XMarkIcon className="h-5 w-5 text-text/60" />
        </button>
        
        <DialogTitle className="text-2xl font-bold text-text mb-2">
          {bookingSuccess ? 'Vendor Saved!' : 'Book your vendor'}
        </DialogTitle>
        <DialogDescription className="text-xs font-medium uppercase tracking-widest text-text/60 mb-6">
          {bookingSuccess 
            ? 'Your vendor has been saved to your shortlist.'
            : 'SAVE YOUR VENDOR DETAILS IN ONE PLACE.'}
        </DialogDescription>
        
        {!bookingSuccess ? (
          <DialogBody>
            <div className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <div className="relative">
                  {/* Outer border - subtle grey */}
                  <div className="absolute inset-0 rounded-full border border-text/20" />
                  {/* Inner border - primary color, more prominent */}
                  <div className={clsx(
                    "absolute inset-[1px] rounded-full border-2 transition-colors",
                    searchQuery ? "border-primary" : "border-primary/60"
                  )} />
                  {/* Input field */}
                  <div className="relative flex items-center">
                    <MagnifyingGlassIcon className="absolute left-5 h-5 w-5 text-text/40 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search vendors..."
                      className="w-full pl-14 pr-6 py-4 rounded-full border-0 bg-transparent text-base text-text placeholder:text-text/50 focus:outline-none focus:ring-0 shadow-none appearance-none"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              {/* Vendor Results */}
              <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                {filteredVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-text/60">No vendors found. Try a different search term.</p>
                  </div>
                ) : (
                  filteredVendors.map((vendor) => {
                    const isSelected = selectedVendorForBooking?.id === vendor.id
                    const isShortlisted = shortlist.some(item => item.vendorHandle === vendor.handle)
                    
                    return (
                      <button
                        key={vendor.id}
                        onClick={() => handleSelectVendor(vendor)}
                        className={clsx(
                          'w-full text-left rounded-xl border-2 p-4 transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                            : 'border-text/10 bg-white dark:bg-background/80 hover:border-primary/30 hover:shadow-sm'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={vendor.heroImage.src}
                              alt={vendor.heroImage.alt}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base text-text line-clamp-1 mb-1">
                                  {vendor.name}
                                </h4>
                                <p className="text-xs text-text/60 uppercase tracking-wide mb-2">
                                  {vendor.category}
                                </p>
                                {vendor.rating && (
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <span className="text-amber-500 font-bold">★</span>
                                    <span className="font-semibold text-text/80">{vendor.rating}</span>
                                    <span className="text-text/40">•</span>
                                    <span className="text-text/60">{vendor.location}</span>
                                  </div>
                                )}
                              </div>
                              {isShortlisted && (
                                <HeartIconSolid className="h-5 w-5 text-red-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </DialogBody>
        ) : (
          <DialogBody>
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircleIconSolid className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-text/80">Your vendor has been saved successfully!</p>
            </div>
          </DialogBody>
        )}
        
        {!bookingSuccess && (
          <DialogActions>
            <Button outline onClick={handleCloseBookingPopup}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVendor}
              disabled={!selectedVendorForBooking}
              className="bg-primary hover:bg-primary/90 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save vendor
            </Button>
          </DialogActions>
        )}
      </div>
    </Dialog>
    </>
  )
}
