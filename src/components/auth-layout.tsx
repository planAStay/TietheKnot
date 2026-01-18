import type React from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col p-2 bg-[#2C2C2C]">
      <div className="flex grow items-start sm:items-center justify-center p-4 sm:p-6 bg-white dark:bg-zinc-950 rounded-lg sm:rounded-lg sm:shadow-lg sm:ring-1 sm:ring-zinc-950/5 m-2 sm:m-4 lg:p-10 overflow-y-auto w-full max-w-full">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </main>
  )
}
