"use client";

import {
  createRoutineSlot,
  deleteRoutineSlot,
  getAvailableSubjects,
  getTeachers,
  updateRoutineSlot,
} from "@/actions/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DayOfWeek,
  DayOfWeekFullLabels,
  RoutineSlotDto,
  TeacherDto,
} from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const slotFormSchema = z.object({
  subjectId: z.number().min(1, "Please select a subject"),
  teacherId: z.number().min(1, "Please select a teacher"),
  room: z.string().optional(),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface EditSlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: RoutineSlotDto | null;
  periodId: number;
  day: DayOfWeek;
  sectionId: number;
}

export function EditSlotModal({
  open,
  onOpenChange,
  slot,
  periodId,
  day,
  sectionId,
}: EditSlotModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [subjects, setSubjects] = useState<
    { id: number; name: string; code: string }[]
  >([]);

  const isEditing = slot !== null;

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      subjectId: slot?.subject?.id,
      teacherId: slot?.teacher?.id,
      room: slot?.room || "",
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      form.reset({
        subjectId: slot?.subject?.id,
        teacherId: slot?.teacher?.id,
        room: slot?.room || "",
      });

      // Load teachers and subjects
      Promise.all([getTeachers(), getAvailableSubjects()]).then(
        ([teachersResult, subjectsResult]) => {
          if (teachersResult.success) {
            setTeachers(teachersResult.data);
          }
          if (subjectsResult.success) {
            setSubjects(subjectsResult.data);
          }
        },
      );
    }
  }, [open, slot, form]);

  const handleSubmit = async (values: SlotFormValues) => {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditing && slot) {
        // Update existing slot
        result = await updateRoutineSlot(sectionId, slot.id, {
          subjectId: values.subjectId,
          teacherId: values.teacherId,
          room: values.room,
        });
      } else {
        // Create new slot
        result = await createRoutineSlot(sectionId, {
          periodId,
          day,
          subjectId: values.subjectId,
          teacherId: values.teacherId,
          room: values.room,
        });
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Routine slot updated successfully"
            : "Routine slot created successfully",
        );
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to save routine slot");
      }
    } catch {
      toast.error("An error occurred while saving the routine slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!slot || !confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteRoutineSlot(sectionId, slot.id);

      if (result.success) {
        toast.success("Routine slot deleted successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to delete routine slot");
      }
    } catch {
      toast.error("An error occurred while deleting the routine slot");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Routine Slot" : "Add Routine Slot"}
          </DialogTitle>
          <DialogDescription>
            {DayOfWeekFullLabels[day]} - Period {periodId}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 pt-4"
        >
          <Controller
            name="subjectId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="subjectId">Subject</FieldLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger id="subjectId">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.name} ({subject.code})
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

          <Controller
            name="teacherId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="teacherId">Teacher</FieldLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger id="teacherId">
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

          <Controller
            name="room"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="room">Room (Optional)</FieldLabel>
                <Input {...field} id="room" placeholder="e.g., Room 101" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex justify-between gap-2 pt-4">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                >
                  <Trash2 className="mr-2 size-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
