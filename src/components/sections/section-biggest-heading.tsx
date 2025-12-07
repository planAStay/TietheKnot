import clsx from 'clsx'
import React from 'react'

interface SectionBiggestHeadingProps {
  className?: string
  heading?: React.ReactNode
  features?: string[]
}

const SectionBiggestHeading: React.FC<SectionBiggestHeadingProps> = ({
  className,
  heading = (
    <>
      Greatest Of <span className="font-serif font-normal italic">Collection</span>
    </>
  ),
  features = ['Breathable Quality', 'Easy To Wear', 'Kind To Planet', 'Premium Viscose'],
}) => {
  return (
    <div className={clsx('', className)}>
      <h1 className="text-center text-[4.75rem] leading-none font-semibold tracking-tighter text-zinc-950 lg:text-[6.5rem] xl:text-[8.3rem] 2xl:text-[10rem] dark:text-white">
        {heading}
      </h1>
      <div className="mt-4 flex flex-wrap justify-between text-sm tracking-wide uppercase 2xl:mt-5">
        {features.map((feature, index) => (
          <div key={index} className="px-2 py-1">
            [ {feature} ]
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionBiggestHeading
