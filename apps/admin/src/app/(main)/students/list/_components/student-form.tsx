"use client";

import {
  StudentFormValues,
  studentSchema,
} from "@/lib/validation/student.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, StudentStatus } from "@repo/shared-types";
import { ImageUploader } from "@repo/ui/components/image-uploader";
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
import { useStepFormValidator } from "@repo/ui/components/ui-kit/stepper";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface StudentFormProps {
  name: string;
  defaultValues?: Partial<StudentFormValues>;
}

export const fileSetting = {
  acceptedImageTypes: {
    "image/jpg": [".jpeg", ".jpg"],
    "image/png": [".png"],
  },
  errorMessages: {
    maxUploadSize: "Max file size is 3MB",
    acceptedImageTypes: "Only JPG and PNG files are allowed",
  },
  description: "JPG or PNG. Max file size 3MB. Aspect ratio 4:4",
  maxUploadSize: 3 * 1024 * 1024,
};

export function StudentForm({ name, defaultValues }: StudentFormProps) {
  const studentForm = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      status: undefined,
      photo: "",
      isOrphan: false,
    },
  });

  useStepFormValidator(name, studentForm);

  useEffect(() => {
    if (defaultValues) {
      studentForm.reset(defaultValues);
    }
  }, [defaultValues, studentForm]);

  return (
    <div className="space-y-6">
      <Controller
        name="photo"
        control={studentForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Photo</FieldLabel>
            <ImageUploader
              fileSetting={fileSetting}
              image={studentForm.getValues(field.name) as string}
              variant="form"
              onChange={(file) => {
                field.onChange(file);
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="firstName"
          control={studentForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                First Name <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="John"
                autoComplete="given-name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={studentForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Last Name <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Doe"
                autoComplete="family-name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="email"
        control={studentForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Email <span className="text-destructive ml-1">*</span>
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder="john.doe@example.com"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="dateOfBirth"
          control={studentForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Date of Birth <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="gender"
          control={studentForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Gender <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Male</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  <SelectItem value={Gender.OTHERS}>Others</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="status"
        control={studentForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Status <span className="text-destructive ml-1">*</span>
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={StudentStatus.SUSPENDED}>
                  Suspended
                </SelectItem>
                <SelectItem value={StudentStatus.BANNED}>Banned</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="isOrphan"
        control={studentForm.control}
        render={({ field }) => (
          <div className="flex items-center gap-2.5 rounded-lg border border-amber-100 bg-amber-50 p-3">
            <input
              type="checkbox"
              id="isOrphan"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
            />
            <div>
              <FieldLabel htmlFor="isOrphan" className="cursor-pointer">
                Mark as Orphan
              </FieldLabel>
              <p className="mt-0.5 text-xs text-slate-400">
                Guardian information will be required in the next step
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
