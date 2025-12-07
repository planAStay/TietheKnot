'use client'

import { useAside } from '@/components/aside'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Fieldset, Label, Legend } from '@/components/fieldset'
import { Text } from '@/components/text'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: true },
      { value: 'beige', label: 'Beige' },
      { value: 'blue', label: 'Blue' },
      { value: 'brown', label: 'Brown' },
      { value: 'green', label: 'Green' },
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'All New Arrivals' },
      { value: 'tees', label: 'Tees' },
      { value: 'crewnecks', label: 'Crewnecks' },
      { value: 'sweatshirts', label: 'Sweatshirts' },
      { value: 'pants-shorts', label: 'Pants & Shorts' },
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

const CategoryFilters1 = () => {
  const { open: openAside } = useAside()

  return (
    <aside>
      <h2 className="sr-only">Filters</h2>

      <button
        type="button"
        onClick={() => openAside('category-filters')}
        className="inline-flex items-center lg:hidden"
      >
        <span className="text-sm font-medium text-gray-700 uppercase">Filters</span>
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-5 shrink-0 text-gray-400"
          size={16}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>

      <div className="hidden lg:block">
        <form className="divide-y divide-gray-200">
          {filters.map((section) => (
            <div key={section.name} className="py-10 first:pt-0 last:pb-0">
              <Fieldset>
                <Legend className="block">
                  <Text className="font-medium">{section.name}</Text>
                </Legend>
                <div className="space-y-3 pt-6">
                  <CheckboxGroup>
                    {section.options.map((option, optionIdx) => (
                      <CheckboxField key={option.value}>
                        <Checkbox name={`${section.id}[]`} value={option.value} defaultChecked={option.checked} />
                        <Label>
                          <Text className="text-zinc-600">{option.label}</Text>
                        </Label>
                      </CheckboxField>
                    ))}
                  </CheckboxGroup>
                </div>
              </Fieldset>
            </div>
          ))}
        </form>
      </div>
    </aside>
  )
}

export default CategoryFilters1
