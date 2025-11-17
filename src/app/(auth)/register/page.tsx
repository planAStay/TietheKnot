import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Strong, Text, TextLink } from '@/components/text'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to start shopping.',
}

export default function Login() {
  return (
    <form action="" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
      <h1 className="sr-only">Create your account</h1>

      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">
          Create a new account to join our community and get access to exclusive offers, rewards and content.
        </Text>
      </div>

      <Field>
        <Label>Email</Label>
        <Input type="email" name="email" />
      </Field>
      <Field>
        <Label>Full name</Label>
        <Input name="name" />
      </Field>
      <Field>
        <Label>Password</Label>
        <Input type="password" name="password" autoComplete="new-password" />
      </Field>
      <Field>
        <Label>Country</Label>
        <Select name="country">
          <option>Canada</option>
          <option>Mexico</option>
          <option>United States</option>
        </Select>
      </Field>
      <CheckboxField>
        <Checkbox name="remember" />
        <Label>Get emails about product updates and news.</Label>
      </CheckboxField>
      <Button type="submit" className="w-full">
        Create account
      </Button>
      <Text>
        Already have an account?{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
