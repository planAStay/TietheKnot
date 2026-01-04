import { getVendorByHandle } from '@/data-wedding'
import { TQuotation, TQuotationStatus } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const KEY = 'ttk_quotations'

export function getQuotations(): TQuotation[] {
  return readStorage<TQuotation[]>(KEY, [])
}

export function addQuotation(request: Omit<TQuotation, 'id' | 'status' | 'createdAt'>): TQuotation[] {
  const vendor = getVendorByHandle(request.vendorHandle)
  const payload: TQuotation = {
    ...request,
    vendorName: vendor?.name || request.vendorName,
    status: 'requested',
    id: `qt-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  const next = [payload, ...getQuotations()]
  writeStorage(KEY, next)
  return next
}

export function updateQuotationStatus(id: string, status: TQuotationStatus): TQuotation[] {
  const next = getQuotations().map((q) => (q.id === id ? { ...q, status } : q))
  writeStorage(KEY, next)
  return next
}

