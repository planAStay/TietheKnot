import SimpleHeader from '@/components/simple-header'
import SimpleFooter from '@/components/simple-footer'
import React, { ReactNode } from 'react'

interface ComponentProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

const ApplicationLayout: React.FC<ComponentProps> = ({ children, header, footer }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      {header !== undefined ? header : <SimpleHeader />}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      {footer !== undefined ? footer : <SimpleFooter />}
    </div>
  )
}

export { ApplicationLayout }
