import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import type { Metadata } from 'next'
import { Address } from './address'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your organization settings.',
}

export default function Settings() {
  return (
    <div className="container">
      <form method="post" className="mx-auto max-w-4xl py-20">
        <Heading>
          Account <span data-slot="italic">Settings</span>
        </Heading>
        <Divider className="my-10" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Organization Name</Text>
            <Text className="text-zinc-500">This will be displayed on your public profile.</Text>
          </div>
          <div>
            <Input aria-label="Organization Name" name="name" placeholder="Mrs. / " />
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Organization Bio</Text>
            <Text className="text-zinc-500">
              This will be displayed on your public profile. Maximum 240 characters.
            </Text>
          </div>
          <div>
            <Textarea aria-label="Organization Bio" name="bio" />
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Organization Email</Text>
            <Text className="text-zinc-500">This is how customers can contact you for support.</Text>
          </div>
          <div className="space-y-4">
            <Input type="email" aria-label="Organization Email" name="email" defaultValue="info@example.com" />
            <CheckboxField>
              <Checkbox name="email_is_public" defaultChecked />
              <Label>Show email on public profile</Label>
            </CheckboxField>
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Address</Text>
            <Text className="text-zinc-500">This is where your organization is registered.</Text>
          </div>
          <Address />
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Currency</Text>
            <Text className="text-zinc-500">The currency that your organization will be collecting.</Text>
          </div>
          <div>
            <Select aria-label="Currency" name="currency" defaultValue="cad">
              <option value="cad">CAD - Canadian Dollar</option>
              <option value="usd">USD - United States Dollar</option>
            </Select>
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-2.5">
          <Button type="reset" outline>
            Reset
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <Divider />
    </div>
  )
}
