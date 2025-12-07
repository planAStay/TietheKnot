import { getVendorByHandle } from '@/data-wedding'
import { TFavorite, TVendor } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const KEY = 'ttk_favorites'

export function getFavorites(): TFavorite[] {
  return readStorage<TFavorite[]>(KEY, [])
}

export function isFavorite(handle: string): boolean {
  return getFavorites().some((fav) => fav.vendorHandle === handle)
}

export function toggleFavorite(handle: string): TFavorite[] {
  const existing = getFavorites()
  if (existing.some((fav) => fav.vendorHandle === handle)) {
    const next = existing.filter((fav) => fav.vendorHandle !== handle)
    writeStorage(KEY, next)
    return next
  }
  const next = [{ vendorHandle: handle, addedAt: new Date().toISOString() }, ...existing]
  writeStorage(KEY, next)
  return next
}

export function getFavoriteVendors(): TVendor[] {
  return getFavorites()
    .map((fav) => getVendorByHandle(fav.vendorHandle))
    .filter(Boolean) as TVendor[]
}

