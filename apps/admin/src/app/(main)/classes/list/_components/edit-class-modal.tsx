"use client";

import { updateClass } from "@/actions/classes";
import { ClassFormValues } from "@/lib/validation/class.schema";
import { ClassDto } from "@repo/shared-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui-kit/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ClassForm } from "./class-form";

interface EditClassModalProps {
  classData: ClassDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClassModal({
  classData,
  open,
  onOpenChange,
}: EditClassModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClassFormValues) => {
    if (!classData) return;

    setIsSubmitting(true);
    try {
      const result = await updateClass(classData.id, values);
      if (result.success) {
        toast.success("Class updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to update class");
      }
    } catch {
      toast.error("An error occurred while updating the class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!classData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Class</DialogTitle>
          <DialogDescription>
            Update the class details below. Manage sections and teachers from
            the class detail page.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <ClassForm
            defaultValues={{
              name: classData.name,
              level: classData.level,
              academicYear: classData.academicYear,
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Update Class"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
