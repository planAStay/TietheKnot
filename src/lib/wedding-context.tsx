'use client'

import { getFavoriteVendors, getFavorites, toggleFavorite } from '@/lib/favorites-manager'
import { addQuotation, getQuotations } from '@/lib/quotations-manager'
import {
  getBudgetCategories,
  getBudgetExpenses,
  addBudgetCategory as addBudgetCategoryFn,
  updateBudgetCategory as updateBudgetCategoryFn,
  deleteBudgetCategory as deleteBudgetCategoryFn,
  addBudgetExpense as addBudgetExpenseFn,
  updateBudgetExpense as updateBudgetExpenseFn,
  deleteBudgetExpense as deleteBudgetExpenseFn,
} from '@/lib/budget-manager'
import {
  getTimelineMilestones,
  getChecklistItems,
  addTimelineMilestone as addTimelineMilestoneFn,
  updateTimelineMilestone as updateTimelineMilestoneFn,
  deleteTimelineMilestone as deleteTimelineMilestoneFn,
  addChecklistItem as addChecklistItemFn,
  updateChecklistItem as updateChecklistItemFn,
  deleteChecklistItem as deleteChecklistItemFn,
  toggleChecklistItem as toggleChecklistItemFn,
  recalculateAllMilestoneDates,
  initializeDefaultChecklistItems,
} from '@/lib/timeline-manager'
import {
  getGuests,
  getHouseholds,
  addGuest as addGuestFn,
  updateGuest as updateGuestFn,
  deleteGuest as deleteGuestFn,
  createHousehold as createHouseholdFn,
  updateHousehold as updateHouseholdFn,
  deleteHousehold as deleteHouseholdFn,
  addToHousehold as addToHouseholdFn,
  removeFromHousehold as removeFromHouseholdFn,
} from '@/lib/guest-manager'
import { readStorage, writeStorage } from '@/lib/local-storage'
import { TFavorite, TQuotation, TWeddingInfo, TVendor, TBudgetCategory, TBudgetExpense, TTimelineMilestone, TChecklistItem, TGuest, TGuestHousehold } from '@/type'
import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

interface WeddingContextValue {
  weddingInfo: TWeddingInfo
  setWeddingInfo: (info: TWeddingInfo) => void
  favorites: TFavorite[]
  favoriteVendors: TVendor[]
  toggleFavorite: (handle: string) => void
  quotations: TQuotation[]
  addQuotation: (payload: Omit<TQuotation, 'id' | 'status' | 'createdAt'>) => void
  // Budget
  budgetCategories: TBudgetCategory[]
  budgetExpenses: TBudgetExpense[]
  addBudgetCategory: (category: Omit<TBudgetCategory, 'id'>) => void
  updateBudgetCategory: (categoryId: string, updates: Partial<Omit<TBudgetCategory, 'id'>>) => void
  deleteBudgetCategory: (categoryId: string) => void
  addBudgetExpense: (expense: Omit<TBudgetExpense, 'id'>) => void
  updateBudgetExpense: (expenseId: string, updates: Partial<Omit<TBudgetExpense, 'id'>>) => void
  deleteBudgetExpense: (expenseId: string) => void
  refreshBudget: () => void
  // Timeline & Checklist
  timelineMilestones: TTimelineMilestone[]
  checklistItems: TChecklistItem[]
  addMilestone: (milestone: Omit<TTimelineMilestone, 'id'>) => void
  updateMilestone: (milestoneId: string, updates: Partial<Omit<TTimelineMilestone, 'id'>>) => void
  deleteMilestone: (milestoneId: string) => void
  addChecklistItem: (item: Omit<TChecklistItem, 'id'>) => void
  updateChecklistItem: (itemId: string, updates: Partial<Omit<TChecklistItem, 'id'>>) => void
  deleteChecklistItem: (itemId: string) => void
  toggleChecklistItem: (itemId: string) => void
  refreshTimeline: () => void
  // Guests
  guests: TGuest[]
  households: TGuestHousehold[]
  addGuest: (guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuest: (guestId: string, updates: Partial<Omit<TGuest, 'id' | 'createdAt'>>) => void
  deleteGuest: (guestId: string) => void
  createHousehold: (name: string, memberIds?: string[]) => void
  updateHousehold: (householdId: string, updates: Partial<Omit<TGuestHousehold, 'id' | 'createdAt'>>) => void
  deleteHousehold: (householdId: string) => void
  addToHousehold: (householdId: string, guestId: string) => void
  removeFromHousehold: (householdId: string, guestId: string) => void
  refreshGuests: () => void
}

const WeddingContext = createContext<WeddingContextValue | undefined>(undefined)

const WEDDING_KEY = 'ttk_wedding_info'

export function WeddingProvider({ children }: { children: React.ReactNode }) {
  const [weddingInfo, setWeddingInfoState] = useState<TWeddingInfo>({})
  const [favorites, setFavorites] = useState<TFavorite[]>([])
  const [favoriteVendors, setFavoriteVendors] = useState<TVendor[]>([])
  const [quotations, setQuotations] = useState<TQuotation[]>([])
  const [budgetCategories, setBudgetCategories] = useState<TBudgetCategory[]>([])
  const [budgetExpenses, setBudgetExpenses] = useState<TBudgetExpense[]>([])
  const [timelineMilestones, setTimelineMilestones] = useState<TTimelineMilestone[]>([])
  const [checklistItems, setChecklistItems] = useState<TChecklistItem[]>([])
  const [guests, setGuests] = useState<TGuest[]>([])
  const [households, setHouseholds] = useState<TGuestHousehold[]>([])

  const refreshBudget = () => {
    setBudgetCategories(getBudgetCategories())
    setBudgetExpenses(getBudgetExpenses())
  }

  const refreshTimeline = () => {
    setTimelineMilestones(getTimelineMilestones())
    setChecklistItems(getChecklistItems())
  }

  const refreshGuests = () => {
    setGuests(getGuests())
    setHouseholds(getHouseholds())
  }

  useEffect(() => {
    const initialWeddingInfo = readStorage<TWeddingInfo>(WEDDING_KEY, {})
    setWeddingInfoState(initialWeddingInfo)
    setFavorites(getFavorites())
    setFavoriteVendors(getFavoriteVendors())
    setQuotations(getQuotations())
    refreshBudget()

    // Initialize timeline milestones and checklist items
    const milestones = getTimelineMilestones()
    setTimelineMilestones(milestones)

    // Recalculate milestone dates if wedding date exists
    if (initialWeddingInfo.weddingDate) {
      recalculateAllMilestoneDates(initialWeddingInfo.weddingDate)
      const updatedMilestones = getTimelineMilestones()
      setTimelineMilestones(updatedMilestones)

      // Initialize default checklist items if none exist
      initializeDefaultChecklistItems(initialWeddingInfo.weddingDate)
      const items = getChecklistItems()
      setChecklistItems(items)
    } else {
      const items = getChecklistItems()
      setChecklistItems(items)
    }
    
    // Initialize guests and households
    refreshGuests()
  }, [])

  const setWeddingInfo = useCallback((info: TWeddingInfo) => {
    setWeddingInfoState(info)
    writeStorage(WEDDING_KEY, info)

    // If wedding date changed, recalculate milestone dates
    if (info.weddingDate) {
      recalculateAllMilestoneDates(info.weddingDate)
      refreshTimeline()
    }
  }, [refreshTimeline])

  const handleToggleFavorite = (handle: string) => {
    const next = toggleFavorite(handle)
    setFavorites(next)
    setFavoriteVendors(getFavoriteVendors())
  }

  const handleAddQuotation = (payload: Omit<TQuotation, 'id' | 'status' | 'createdAt'>) => {
    const next = addQuotation(payload)
    setQuotations(next)
  }

  // Budget handlers
  const handleAddBudgetCategory = (category: Omit<TBudgetCategory, 'id'>) => {
    addBudgetCategoryFn(category)
    refreshBudget()
  }

  const handleUpdateBudgetCategory = (categoryId: string, updates: Partial<Omit<TBudgetCategory, 'id'>>) => {
    updateBudgetCategoryFn(categoryId, updates)
    refreshBudget()
  }

  const handleDeleteBudgetCategory = (categoryId: string) => {
    deleteBudgetCategoryFn(categoryId)
    refreshBudget()
  }

  const handleAddBudgetExpense = (expense: Omit<TBudgetExpense, 'id'>) => {
    addBudgetExpenseFn(expense)
    refreshBudget()
  }

  const handleUpdateBudgetExpense = (expenseId: string, updates: Partial<Omit<TBudgetExpense, 'id'>>) => {
    updateBudgetExpenseFn(expenseId, updates)
    refreshBudget()
  }

  const handleDeleteBudgetExpense = (expenseId: string) => {
    deleteBudgetExpenseFn(expenseId)
    refreshBudget()
  }

  // Timeline & Checklist handlers
  const handleAddMilestone = (milestone: Omit<TTimelineMilestone, 'id'>) => {
    addTimelineMilestoneFn(milestone)
    refreshTimeline()
    // Recalculate dates if wedding date exists
    if (weddingInfo.weddingDate) {
      recalculateAllMilestoneDates(weddingInfo.weddingDate)
      refreshTimeline()
    }
  }

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<Omit<TTimelineMilestone, 'id'>>) => {
    updateTimelineMilestoneFn(milestoneId, updates)
    refreshTimeline()
    // Recalculate dates if wedding date exists and dates were updated
    if (weddingInfo.weddingDate && (updates.monthsBefore || updates.customStartDate || updates.customEndDate)) {
      recalculateAllMilestoneDates(weddingInfo.weddingDate)
      refreshTimeline()
    }
  }

  const handleDeleteMilestone = (milestoneId: string) => {
    deleteTimelineMilestoneFn(milestoneId)
    refreshTimeline()
  }

  const handleAddChecklistItem = (item: Omit<TChecklistItem, 'id'>) => {
    addChecklistItemFn(item)
    refreshTimeline()
  }

  const handleUpdateChecklistItem = (itemId: string, updates: Partial<Omit<TChecklistItem, 'id'>>) => {
    updateChecklistItemFn(itemId, updates)
    refreshTimeline()
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    deleteChecklistItemFn(itemId)
    refreshTimeline()
  }

  const handleToggleChecklistItem = (itemId: string) => {
    toggleChecklistItemFn(itemId)
    refreshTimeline()
  }

  // Guest handlers
  const handleAddGuest = (guest: Omit<TGuest, 'id' | 'createdAt' | 'updatedAt'>) => {
    addGuestFn(guest)
    refreshGuests()
  }

  const handleUpdateGuest = (guestId: string, updates: Partial<Omit<TGuest, 'id' | 'createdAt'>>) => {
    updateGuestFn(guestId, updates)
    refreshGuests()
  }

  const handleDeleteGuest = (guestId: string) => {
    deleteGuestFn(guestId)
    refreshGuests()
  }

  const handleCreateHousehold = (name: string, memberIds?: string[]) => {
    createHouseholdFn(name, memberIds || [])
    refreshGuests()
  }

  const handleUpdateHousehold = (householdId: string, updates: Partial<Omit<TGuestHousehold, 'id' | 'createdAt'>>) => {
    updateHouseholdFn(householdId, updates)
    refreshGuests()
  }

  const handleDeleteHousehold = (householdId: string) => {
    deleteHouseholdFn(householdId)
    refreshGuests()
  }

  const handleAddToHousehold = (householdId: string, guestId: string) => {
    addToHouseholdFn(householdId, guestId)
    refreshGuests()
  }

  const handleRemoveFromHousehold = (householdId: string, guestId: string) => {
    removeFromHouseholdFn(householdId, guestId)
    refreshGuests()
  }

  const value = useMemo(
    () => ({
      weddingInfo,
      setWeddingInfo,
      favorites,
      favoriteVendors,
      toggleFavorite: handleToggleFavorite,
      quotations,
      addQuotation: handleAddQuotation,
      budgetCategories,
      budgetExpenses,
      addBudgetCategory: handleAddBudgetCategory,
      updateBudgetCategory: handleUpdateBudgetCategory,
      deleteBudgetCategory: handleDeleteBudgetCategory,
      addBudgetExpense: handleAddBudgetExpense,
      updateBudgetExpense: handleUpdateBudgetExpense,
      deleteBudgetExpense: handleDeleteBudgetExpense,
      refreshBudget,
      timelineMilestones,
      checklistItems,
      addMilestone: handleAddMilestone,
      updateMilestone: handleUpdateMilestone,
      deleteMilestone: handleDeleteMilestone,
      addChecklistItem: handleAddChecklistItem,
      updateChecklistItem: handleUpdateChecklistItem,
      deleteChecklistItem: handleDeleteChecklistItem,
      toggleChecklistItem: handleToggleChecklistItem,
      refreshTimeline,
      guests,
      households,
      addGuest: handleAddGuest,
      updateGuest: handleUpdateGuest,
      deleteGuest: handleDeleteGuest,
      createHousehold: handleCreateHousehold,
      updateHousehold: handleUpdateHousehold,
      deleteHousehold: handleDeleteHousehold,
      addToHousehold: handleAddToHousehold,
      removeFromHousehold: handleRemoveFromHousehold,
      refreshGuests,
    }),
    [
      weddingInfo,
      favorites,
      favoriteVendors,
      quotations,
      budgetCategories,
      budgetExpenses,
      timelineMilestones,
      checklistItems,
      guests,
      households,
      handleToggleFavorite,
      handleAddQuotation,
      handleAddBudgetCategory,
      handleUpdateBudgetCategory,
      handleDeleteBudgetCategory,
      handleAddBudgetExpense,
      handleUpdateBudgetExpense,
      handleDeleteBudgetExpense,
      refreshBudget,
      handleAddMilestone,
      handleUpdateMilestone,
      handleDeleteMilestone,
      handleAddChecklistItem,
      handleUpdateChecklistItem,
      handleDeleteChecklistItem,
      handleToggleChecklistItem,
      refreshTimeline,
      handleAddGuest,
      handleUpdateGuest,
      handleDeleteGuest,
      handleCreateHousehold,
      handleUpdateHousehold,
      handleDeleteHousehold,
      handleAddToHousehold,
      handleRemoveFromHousehold,
      refreshGuests,
      setWeddingInfo,
    ]
  )

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider')
  return ctx
}

