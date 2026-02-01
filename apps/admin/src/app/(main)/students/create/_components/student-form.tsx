"use client";

import { useMutation } from "@/hooks/use-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui-kit/field";
import { Input } from "@repo/ui/components/ui-kit/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui-kit/select";
import { Calendar, Mail, ShieldCheck, User, UserCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Gender, StudentStatus } from "./student.enum";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.nativeEnum(Gender, {
    message: "Please select a gender",
  }),
  status: z.nativeEnum(StudentStatus),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentForm() {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      status: StudentStatus.ACTIVE,
    },
  });

  const { action, isPending } = useMutation(
    async (state: unknown, formData: FormData) => {
      console.log("Form data submitted:", Object.fromEntries(formData));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, data: {} };
    },
  );

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Student Information
        </CardTitle>
        <CardDescription>
          Enter the student&apos;s personal details to create a new profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="firstName"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <User className="text-muted-foreground size-4" />
                      First Name
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="bg-neutral-50/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="lastName"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <User className="text-muted-foreground size-4" />
                      Last Name
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="bg-neutral-50/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className="flex items-center gap-2 text-neutral-700"
                  >
                    <Mail className="text-muted-foreground size-4" />
                    Email Address
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-neutral-50/50"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <Calendar className="text-muted-foreground size-4" />
                      Date of Birth
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="bg-neutral-50/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="gender"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <UserCheck className="text-muted-foreground size-4" />
                      Gender
                    </FieldLabel>
                    <FieldContent>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        name={field.name}
                      >
                        <SelectTrigger
                          id="gender"
                          aria-invalid={fieldState.invalid}
                          className="w-full border-neutral-200 bg-neutral-50/50 shadow-none"
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Gender).map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="status"
                    className="flex items-center gap-2 text-neutral-700"
                  >
                    <ShieldCheck className="text-muted-foreground size-4" />
                    Status
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      name={field.name}
                    >
                      <SelectTrigger
                        id="status"
                        aria-invalid={fieldState.invalid}
                        className="w-full border-neutral-200 bg-neutral-50/50 shadow-none"
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(StudentStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <div className="pt-4">
              <Button
                disabled={isPending}
                className="w-full rounded-xl px-12 py-6 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] md:w-auto"
                type="submit"
              >
                {isPending ? "Creating..." : "Create Student Profile"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
