'use client'

import clsx from 'clsx'

interface PricingPdfSectionProps {
  pdfPath: string
  className?: string
}

export default function PricingPdfSection({ pdfPath, className }: PricingPdfSectionProps) {
  const filename = pdfPath.split('/').pop() || 'pricing.pdf'

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfPath
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <div className="w-full max-w-md mx-auto rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* PDF Icon */}
        <div className="flex justify-center mb-4 sm:mb-5 lg:mb-6">
          <div className="relative">
            <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-lg bg-rose-50 flex items-center justify-center">
              <svg
                className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-rose-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            {/* PDF Badge */}
            <div className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded">
              PDF
            </div>
          </div>
        </div>

        {/* Filename */}
        <div className="text-center mb-4 sm:mb-5 lg:mb-6">
          <p className="text-xs sm:text-sm text-zinc-500 mb-1">Pricing Document</p>
          <p className="text-sm sm:text-base lg:text-lg font-semibold text-zinc-900 break-words">{filename}</p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold py-3 sm:py-3.5 lg:py-4 px-4 sm:px-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-2.5 shadow-sm hover:shadow-md"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="text-sm sm:text-base">Download PDF</span>
        </button>

        {/* Optional: File size or additional info */}
        <p className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-zinc-400">
          Click to download the complete pricing information
        </p>
      </div>
    </div>
  )
}


