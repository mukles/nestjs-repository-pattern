"use client";

import { createSection, getTeachers } from "@/actions/classes";
import {
  SectionFormValues,
  sectionSchema,
} from "@/lib/validation/class.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherDto } from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui-kit/dialog";
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
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateSectionModalProps {
  classId: number;
}

export function CreateSectionModal({ classId }: CreateSectionModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      capacity: 30,
      classTeacherId: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      // Load teachers when modal opens
      getTeachers().then((result) => {
        if (result.success) {
          setTeachers(result.data);
        }
      });
    }
  }, [open]);

  const handleSubmit = async (values: SectionFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createSection(classId, {
        name: values.name,
        capacity: values.capacity,
        classTeacherId: values.classTeacherId,
      });

      if (result.success) {
        toast.success("Section created successfully");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to create section");
      }
    } catch {
      toast.error("An error occurred while creating the section");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="px-4 py-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Section
          </DialogTitle>
          <DialogDescription>
            Add a new section to this class. You can assign a class teacher and
            set the capacity.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 pt-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Section Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="A, B, C..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="capacity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="30"
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 0)
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="classTeacherId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Class Teacher (Optional)
                </FieldLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value, 10) : undefined)
                  }
                  value={field.value?.toString()}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                      >
                        {teacher.firstName} {teacher.lastName}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Section"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
