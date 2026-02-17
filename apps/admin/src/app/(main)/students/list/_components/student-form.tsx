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
import { useStepperContext } from "@repo/ui/components/ui-kit/stepper";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface StudentFormProps {
  stepNumber: number;
  onStepValid?: (values: StudentFormValues) => void;
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

export function StudentForm({
  stepNumber,
  onStepValid,
  defaultValues,
}: StudentFormProps) {
  const { registerStepValidator } = useStepperContext();
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
      fatherId: undefined,
      motherId: undefined,
      guardianId: undefined,
      guardianRelation: "",
      isOrphan: false,
    },
  });

  const handleValidation = useCallback(async () => {
    const isValid = await studentForm.trigger();
    if (isValid && onStepValid) {
      onStepValid(studentForm.getValues());
    }
    return isValid;
  }, [studentForm, onStepValid]);

  useEffect(() => {
    return registerStepValidator(stepNumber, handleValidation);
  }, [handleValidation, registerStepValidator, stepNumber]);

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
              <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
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
              <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
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
      {/* Email */}
      <Controller
        name="email"
        control={studentForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
      {/* Date of Birth & Gender Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="dateOfBirth"
          control={studentForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
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
              <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
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
      {/* Status */}
      <Controller
        name="status"
        control={studentForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Status</FieldLabel>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isOrphan"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
            <FieldLabel htmlFor="isOrphan">Is Orphan?</FieldLabel>
          </div>
        )}
      />
    </div>
  );
}
