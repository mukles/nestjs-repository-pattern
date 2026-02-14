"use client";

import { subjectSchema } from "@/lib/validation/class.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassReference, TeacherReference } from "@repo/shared-types";
import { Checkbox } from "@repo/ui/components/ui-kit/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui-kit/field";
import { Input } from "@repo/ui/components/ui-kit/input";
import { Label } from "@repo/ui/components/ui-kit/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  availableClasses: ClassReference[];
  availableTeachers: TeacherReference[];
  defaultValues?: Partial<SubjectFormValues>;
  onSubmit: (values: SubjectFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function SubjectForm({
  availableClasses,
  availableTeachers,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Create Subject",
}: SubjectFormProps) {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      classIds: [],
      teacherIds: [],
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject Name */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Subject Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g., Mathematics, English, Physics"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Code */}
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Subject Code</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g., MATH, ENG, PHY"
              className="font-mono uppercase"
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description (optional)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Brief description of the subject..."
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Class Assignments */}
      <Controller
        name="classIds"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Assign to Classes</FieldLabel>
            <div className="border-input mt-2 max-h-36 space-y-2 overflow-y-auto rounded-md border p-3">
              {availableClasses.map((classItem) => {
                const isChecked = field.value?.includes(classItem.id) || false;
                return (
                  <div key={classItem.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`class-${classItem.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentIds = field.value || [];
                        if (checked) {
                          field.onChange([...currentIds, classItem.id]);
                        } else {
                          field.onChange(
                            currentIds.filter((id) => id !== classItem.id),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`class-${classItem.id}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {classItem.name}
                    </Label>
                  </div>
                );
              })}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Teacher Assignments */}
      <Controller
        name="teacherIds"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Assign Teachers</FieldLabel>
            <div className="border-input mt-2 max-h-36 space-y-2 overflow-y-auto rounded-md border p-3">
              {availableTeachers.map((teacher) => {
                const isChecked = field.value?.includes(teacher.id) || false;
                return (
                  <div key={teacher.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`teacher-${teacher.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentIds = field.value || [];
                        if (checked) {
                          field.onChange([...currentIds, teacher.id]);
                        } else {
                          field.onChange(
                            currentIds.filter((id) => id !== teacher.id),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`teacher-${teacher.id}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {teacher.firstName} {teacher.lastName}
                    </Label>
                  </div>
                );
              })}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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
