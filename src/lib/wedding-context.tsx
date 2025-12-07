'use client'

import { getFavoriteVendors, getFavorites, toggleFavorite } from '@/lib/favorites-manager'
import { addQuotation, getQuotations } from '@/lib/quotations-manager'
import { readStorage, writeStorage } from '@/lib/local-storage'
import { TFavorite, TQuotation, TWeddingInfo, TVendor } from '@/type'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface WeddingContextValue {
  weddingInfo: TWeddingInfo
  setWeddingInfo: (info: TWeddingInfo) => void
  favorites: TFavorite[]
  favoriteVendors: TVendor[]
  toggleFavorite: (handle: string) => void
  quotations: TQuotation[]
  addQuotation: (payload: Omit<TQuotation, 'id' | 'status' | 'createdAt' | 'vendorName'>) => void
}

const WeddingContext = createContext<WeddingContextValue | undefined>(undefined)

const WEDDING_KEY = 'ttk_wedding_info'

export function WeddingProvider({ children }: { children: React.ReactNode }) {
  const [weddingInfo, setWeddingInfoState] = useState<TWeddingInfo>({})
  const [favorites, setFavorites] = useState<TFavorite[]>([])
  const [favoriteVendors, setFavoriteVendors] = useState<TVendor[]>([])
  const [quotations, setQuotations] = useState<TQuotation[]>([])

  useEffect(() => {
    setWeddingInfoState(readStorage<TWeddingInfo>(WEDDING_KEY, {}))
    setFavorites(getFavorites())
    setFavoriteVendors(getFavoriteVendors())
    setQuotations(getQuotations())
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

  const handleAddQuotation = (payload: Omit<TQuotation, 'id' | 'status' | 'createdAt' | 'vendorName'>) => {
    const next = addQuotation(payload)
    setQuotations(next)
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
    }),
    [weddingInfo, favorites, favoriteVendors, quotations]
  )

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider')
  return ctx
}

