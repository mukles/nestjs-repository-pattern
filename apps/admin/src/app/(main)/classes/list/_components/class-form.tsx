"use client";

import { ClassFormValues, classSchema } from "@/lib/validation/class.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassLevel, ClassLevel_VALUES } from "@repo/shared-types";
import {
  Field,
  FieldError,
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
import { Controller, useForm } from "react-hook-form";

const levelLabels: Record<ClassLevel, string> = {
  [ClassLevel.NURSERY]: "Nursery",
  [ClassLevel.KINDERGARTEN]: "Kindergarten",
  [ClassLevel.PRIMARY]: "Primary",
  [ClassLevel.MIDDLE]: "Middle School",
  [ClassLevel.SECONDARY]: "Secondary",
  [ClassLevel.HIGHER_SECONDARY]: "Higher Secondary",
};

interface ClassFormProps {
  defaultValues?: Partial<ClassFormValues>;
  onSubmit: (values: ClassFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ClassForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Create Class",
}: ClassFormProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      level: undefined,
      academicYear: "",
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Class Name */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Class Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g., Grade 5, Class 10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Level & Academic Year Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="level"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Level</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ClassLevel_VALUES.map((level) => (
                    <SelectItem key={level} value={level}>
                      {levelLabels[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="academicYear"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Academic Year</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="e.g., 2026 or 2025-2026"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <p className="text-muted-foreground text-sm">
        After creating the class, you can add sections with capacity and assign
        teachers.
      </p>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
