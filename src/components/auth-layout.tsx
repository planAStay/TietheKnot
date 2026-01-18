import type React from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col p-2 bg-[#2C2C2C]">
      <div className="flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:ring-1 lg:ring-zinc-950/5">
        {children}
      </div>
    </main>
  )
}
