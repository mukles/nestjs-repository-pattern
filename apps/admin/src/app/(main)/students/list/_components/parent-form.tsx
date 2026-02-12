"use client";

import {
  ParentFormValues,
  parentSchema,
  SingleParentValues,
} from "@/lib/validation/parent.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParentType } from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
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
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const PARENT_TYPE_LABELS: Record<ParentType, string> = {
  [ParentType.FATHER]: "Father",
  [ParentType.MOTHER]: "Mother",
  [ParentType.GUARDIAN]: "Guardian",
};

const DEFAULT_PARENT: SingleParentValues = {
  name: "",
  email: "",
  phone: "",
  occupation: "",
  type: ParentType.FATHER,
};

interface ParentFormProps {
  stepNumber: number;
  onStepValid?: (values: ParentFormValues) => void;
  defaultValues?: Partial<ParentFormValues>;
}

export function ParentForm({
  stepNumber,
  onStepValid,
  defaultValues,
}: ParentFormProps) {
  const { registerStepValidator } = useStepperContext();

  const parentForm = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    mode: "onChange",
    defaultValues: {
      parents: defaultValues?.parents ?? [DEFAULT_PARENT],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: parentForm.control,
    name: "parents",
  });

  const handleValidation = useCallback(async () => {
    const isValid = await parentForm.trigger();
    if (isValid && onStepValid) {
      onStepValid(parentForm.getValues());
    }
    return isValid;
  }, [parentForm, onStepValid]);

  useEffect(() => {
    return registerStepValidator(stepNumber, handleValidation);
  }, [handleValidation, registerStepValidator, stepNumber]);

  useEffect(() => {
    if (defaultValues) {
      parentForm.reset(defaultValues);
    }
  }, [defaultValues, parentForm]);

  const addParent = () => {
    append(DEFAULT_PARENT);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative space-y-4 rounded-lg border p-4"
        >
          {/* Header with remove button */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Parent {index + 1}</h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>

          {/* Name */}
          <Controller
            name={`parents.${index}.name`}
            control={parentForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Full name"
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name={`parents.${index}.email`}
              control={parentForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name={`parents.${index}.phone`}
              control={parentForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    aria-invalid={fieldState.invalid}
                    placeholder="+1234567890"
                    autoComplete="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Occupation & Type Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name={`parents.${index}.occupation`}
              control={parentForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Occupation</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Occupation"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name={`parents.${index}.type`}
              control={parentForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Parent Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select parent type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ParentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {PARENT_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addParent}
        className="w-full"
      >
        <Plus className="mr-2 size-4" />
        Add More Parent
      </Button>
    </div>
  );
}
