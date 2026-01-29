import {
  Field,
  FieldDescription,
  FieldSeparator,
} from '@repo/ui/components/ui-kit/field';
import { LoginForm } from './_components/login-form';
import { Button } from '@repo/ui/components/ui-kit/button';
import { Borders } from './_components/borders';

import { AnimatedTooltip } from '@repo/ui/components/ui-kit/animated-tooltip';
import { ProductFeatures } from './_components/product-features';
import Link from 'next/link';

const people = [
  {
    id: 1,
    name: 'Ava Thompson',
    designation: 'Product Manager',
    image: '/images/educators/educator_avatar_1_1769667282209.png',
  },
  {
    id: 2,
    name: 'Liam Carter',
    designation: 'Lead Designer',
    image: '/images/educators/educator_avatar_2_1769667301297.png',
  },
  {
    id: 3,
    name: 'Sophia Lee',
    designation: 'Frontend Engineer',
    image: '/images/educators/educator_avatar_3_1769667316538.png',
  },
  {
    id: 4,
    name: 'Noah Patel',
    designation: 'Backend Developer',
    image: '/images/educators/educator_avatar_4_1769667335754.png',
  },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="flex h-full min-h-screen w-full">
        <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="">
              <h1 className="mt-8 text-2xl leading-9 font-bold tracking-tight text-black dark:text-white">
                Sign in to your account
              </h1>
            </div>
            <div className="mt-10">
              <LoginForm />

              <div className="mt-10">
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <Field className="mt-6 flex w-full items-center justify-center">
                  <Button type="button" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Google</span>
                  </Button>
                </Field>

                <FieldDescription className="!mt-8 block text-center text-sm text-neutral-600 dark:text-neutral-400">
                  By clicking continue, you agree to our{' '}
                  <Link
                    href="#"
                    className="text-black !no-underline dark:text-white"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    className="text-black !no-underline dark:text-white"
                    href="#"
                  >
                    Privacy Policy
                  </Link>
                  .
                </FieldDescription>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-neutral-100 bg-gray-50 md:flex dark:border-neutral-800 dark:bg-neutral-900">
        <Borders />
        <div className="relative z-30 mx-auto max-w-xl p-8 text-center">
          <div className="mb-10 flex w-full flex-row items-center justify-center">
            <AnimatedTooltip items={people} />
            <div className="ml-6 text-left">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Trusted by Developers & Founders
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Join our community of dedicated educators who are
              </p>
            </div>
          </div>

          <div className="mt-10">
            <ProductFeatures />
          </div>
        </div>
      </div>
    </div>
  );
}
