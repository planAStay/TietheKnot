'use client'

import { useAside } from '@/components/aside'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Fieldset, Label } from '@/components/fieldset'
import { Text } from '@/components/text'
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { ArrowDown01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'tees', label: 'Tees', checked: true },
      { value: 'crewnecks', label: 'Crewnecks' },
      { value: 'hats', label: 'Hats' },
      { value: 'bundles', label: 'Bundles' },
      { value: 'carry', label: 'Carry' },
      { value: 'objects', label: 'Objects' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    options: [
      { value: 'clothing-company', label: 'Clothing Inc.' },
      { value: 'fashion-inc', label: 'Fashion Inc.' },
      { value: 'shoes-n-more', label: "Shoes 'n More" },
      { value: 'supplies-n-stuff', label: "Supplies 'n Stuff" },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White' },
      { value: 'black', label: 'Black' },
      { value: 'grey', label: 'Grey' },
      { value: 'blue', label: 'Blue' },
      { value: 'olive', label: 'Olive' },
      { value: 'tan', label: 'Tan' },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: '2xl', label: '2XL' },
    ],
  },
]

interface Props {
  className?: string
}

export default function CategoryFilters2({ className }: Props) {
  const { open: openAside } = useAside()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => openAside('category-filters')}
        className="inline-flex items-center sm:hidden"
      >
        <span className="text-sm font-medium text-zinc-700 uppercase">Filters</span>
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-5 shrink-0 text-zinc-400"
          size={16}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>

      <PopoverGroup className="hidden sm:flex sm:items-baseline sm:space-x-8">
        {filters.map((section, sectionIdx) => {
          const bage = section.options.filter((option) => option.checked).length
          return (
            <Popover key={section.name} id="menu" className="relative inline-block text-left">
              <div>
                <PopoverButton className="group inline-flex items-center justify-center focus-visible:outline-none">
                  <Text>{section.name}</Text>
                  {bage ? (
                    <span className="ml-1 text-xs font-semibold text-zinc-950 tabular-nums underline">({bage})</span>
                  ) : null}

                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="-mr-1 ml-1 size-5 shrink-0 text-zinc-400 group-hover:text-zinc-500"
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </PopoverButton>
              </div>

              <PopoverPanel
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <Fieldset>
                  <CheckboxGroup className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <CheckboxField key={option.value}>
                        <Checkbox
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          name={`${section.id}[]`}
                        />
                        <Label>
                          <Text>{option.label}</Text>
                        </Label>
                      </CheckboxField>
                    ))}
                  </CheckboxGroup>
                </Fieldset>
              </PopoverPanel>
            </Popover>
          )
        })}
      </PopoverGroup>
    </div>
  )
}
