import { Logo } from '@/app/logo'

export default function LogoClouds() {
  const logos = [
    { id: 1, className: 'col-span-2 max-h-12 w-full object-contain lg:col-span-1' },
    { id: 2, className: 'col-span-2 max-h-12 w-full object-contain lg:col-span-1' },
    { id: 3, className: 'col-span-2 max-h-12 w-full object-contain lg:col-span-1' },
    { id: 4, className: 'col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1' },
    { id: 5, className: 'col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1' },
  ]

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {logos.map((logo) => (
            <Logo key={logo.id} className={logo.className} />
          ))}
        </div>
      </div>
    </div>
  )
}
