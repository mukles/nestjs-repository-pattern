"use client";

import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui-kit/field";
import { Input } from "@repo/ui/components/ui-kit/input";
import Link from "next/link";
import { PasswordInput } from "@repo/ui/components/password-input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { loginUser } from "@/actions/auth";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .refine((val) => z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    }),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "superadmin@example.com",
      password: "SuperAdmin@123",
    },
  });

  const [state, action, pending] = useActionState(loginUser, undefined);

  return (
    <form className="space-y-6" action={action}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-neutral-700 capitalize"
              >
                {field.name}
              </FieldLabel>
              <Input
                className="placeholder:text-gray-400"
                id="email"
                type="email"
                placeholder="m@example.com"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password"
                className="text-neutral-700 capitalize"
              >
                {field.name}
              </FieldLabel>
              <PasswordInput {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm leading-6">
            <Link href="#" className="font-normal text-neutral-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <Field>
          <Button disabled={pending} className="rounded-full" type="submit">
            Login
          </Button>
          <p className="dark:text-muted-dark mt-4 text-center text-sm text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-black dark:text-white">
              Sign up
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
