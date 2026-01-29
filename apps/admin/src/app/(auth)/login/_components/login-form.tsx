import { Button } from '@repo/ui/components/ui-kit/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@repo/ui/components/ui-kit/field';
import { Input } from '@repo/ui/components/ui-kit/input';
import Link from 'next/link';
import { PasswordInput } from '@repo/ui/components/password-input';

export function LoginForm() {
  return (
    <form className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email" className="text-neutral-700">
            Email
          </FieldLabel>
          <Input
            className="placeholder:text-gray-400"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-neutral-700">
              Password
            </FieldLabel>
          </div>
          <PasswordInput />
          {/* <Input
            className="placeholder:text-gray-400"
            id="password"
            type="password"
            required
          /> */}
        </Field>

        <div className="flex items-center justify-between">
          <div className="text-sm leading-6">
            <Link href="#" className="font-normal text-neutral-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <Field>
          <Button className="rounded-full" type="submit">
            Login
          </Button>
          <p className="dark:text-muted-dark mt-4 text-center text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-black dark:text-white">
              Sign up
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
