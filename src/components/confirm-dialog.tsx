'use client'

import { useState, createContext, useContext, useCallback, ReactNode } from 'react'
import { Dialog, DialogTitle, DialogDescription, DialogActions } from './dialog'
import { Button } from './button'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ConfirmDialogOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean
  resolve?: (value: boolean) => void
}

interface ConfirmDialogContextType {
  showDialog: (options: ConfirmDialogOptions) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmDialogState>({
    isOpen: false,
    message: '',
    title: 'Confirm',
    confirmText: 'OK',
    cancelText: 'Cancel',
    variant: 'default',
  })

  const showDialog = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve,
      })
    })
  }, [])

  const handleConfirm = () => {
    state.resolve?.(true)
    setState((prev) => ({ ...prev, isOpen: false, resolve: undefined }))
  }

  const handleCancel = () => {
    state.resolve?.(false)
    setState((prev) => ({ ...prev, isOpen: false, resolve: undefined }))
  }

  return (
    <ConfirmDialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog open={state.isOpen} onClose={handleCancel}>
        <DialogTitle>{state.title}</DialogTitle>
        <DialogDescription>
          <div className="flex items-start gap-4">
            {state.variant === 'destructive' && (
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-text/80">{state.message}</p>
          </div>
        </DialogDescription>
        <DialogActions>
          <Button outline onClick={handleCancel}>
            {state.cancelText}
          </Button>
          <Button
            color={state.variant === 'destructive' ? 'red' : 'accent'}
            onClick={handleConfirm}
          >
            {state.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  )
}

function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider')
  }
  return context.showDialog
}

/**
 * Show a confirmation dialog
 * @param options Dialog options
 * @returns Promise that resolves to true if confirmed, false if cancelled
 */
export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
  // This function is used for convenience but requires the hook internally
  // For better React patterns, use the hook in components
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }
  
  // Fallback to window.confirm if provider not available (shouldn't happen in practice)
  const result = window.confirm(options.message)
  return Promise.resolve(result)
}

/**
 * Convenience function for destructive confirmations (e.g., deletions)
 * Note: This uses window.confirm as fallback. For better UX, use confirmDestructiveHook in components.
 */
export function confirmDestructive(
  message: string,
  title: string = 'Are you sure?'
): Promise<boolean> {
  return confirmDialog({
    title,
    message,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
}

/**
 * Hook version for use in components (preferred)
 */
export function useConfirmDestructive() {
  const showDialog = useConfirmDialog()
  
  return useCallback(
    (message: string, title: string = 'Are you sure?') => {
      return showDialog({
        title,
        message,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
      })
    },
    [showDialog]
  )
}

