'use client'

import { readStorage, writeStorage } from '@/lib/local-storage'
import { TWeddingInfo } from '@/type'
import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

interface WeddingInfoContextValue {
  weddingInfo: TWeddingInfo
  setWeddingInfo: (info: TWeddingInfo) => void
}

const WeddingInfoContext = createContext<WeddingInfoContextValue | undefined>(undefined)

const WEDDING_KEY = 'ttk_wedding_info'

export function WeddingInfoProvider({ children }: { children: React.ReactNode }) {
  const [weddingInfo, setWeddingInfoState] = useState<TWeddingInfo>({})

  useEffect(() => {
    const initialWeddingInfo = readStorage<TWeddingInfo>(WEDDING_KEY, {})
    setWeddingInfoState(initialWeddingInfo)
  }, [])

  const setWeddingInfo = useCallback((info: TWeddingInfo) => {
    setWeddingInfoState(info)
    writeStorage(WEDDING_KEY, info)
  }, [])

  const value = useMemo(
    () => ({
      weddingInfo,
      setWeddingInfo,
    }),
    [weddingInfo, setWeddingInfo]
  )

  return <WeddingInfoContext.Provider value={value}>{children}</WeddingInfoContext.Provider>
}

export function useWeddingInfo() {
  const ctx = useContext(WeddingInfoContext)
  if (!ctx) throw new Error('useWeddingInfo must be used within WeddingInfoProvider')
  return ctx
}

