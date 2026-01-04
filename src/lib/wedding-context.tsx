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
import { readStorage, writeStorage } from '@/lib/local-storage'
import { TFavorite, TQuotation, TWeddingInfo, TVendor, TBudgetCategory, TBudgetExpense } from '@/type'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

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

  const refreshBudget = () => {
    setBudgetCategories(getBudgetCategories())
    setBudgetExpenses(getBudgetExpenses())
  }

  useEffect(() => {
    setWeddingInfoState(readStorage<TWeddingInfo>(WEDDING_KEY, {}))
    setFavorites(getFavorites())
    setFavoriteVendors(getFavoriteVendors())
    setQuotations(getQuotations())
    refreshBudget()
  }, [])

  const setWeddingInfo = (info: TWeddingInfo) => {
    setWeddingInfoState(info)
    writeStorage(WEDDING_KEY, info)
  }

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
    }),
    [
      weddingInfo,
      favorites,
      favoriteVendors,
      quotations,
      budgetCategories,
      budgetExpenses,
      handleToggleFavorite,
      handleAddQuotation,
      handleAddBudgetCategory,
      handleUpdateBudgetCategory,
      handleDeleteBudgetCategory,
      handleAddBudgetExpense,
      handleUpdateBudgetExpense,
      handleDeleteBudgetExpense,
      refreshBudget,
    ]
  )

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider')
  return ctx
}

