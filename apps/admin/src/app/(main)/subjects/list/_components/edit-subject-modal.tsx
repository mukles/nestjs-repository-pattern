"use client";

import { updateSubject } from "@/actions/subjects";
import {
  ClassReference,
  SubjectDto,
  TeacherReference,
  UpdateSubjectDto,
} from "@repo/shared-types";
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
import { SubjectForm } from "./subject-form";

interface EditSubjectModalProps {
  subject: SubjectDto | null;
  availableClasses: ClassReference[];
  availableTeachers: TeacherReference[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubjectModal({
  subject,
  availableClasses,
  availableTeachers,
  open,
  onOpenChange,
}: EditSubjectModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateSubjectDto) => {
    if (!subject) return;

    setIsSubmitting(true);
    try {
      const result = await updateSubject(subject.id, values);
      if (result.success) {
        toast.success("Subject updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to update subject");
      }
    } catch {
      toast.error("An error occurred while updating the subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!subject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Subject</DialogTitle>
          <DialogDescription>
            Update the subject details below.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <SubjectForm
            availableClasses={availableClasses}
            availableTeachers={availableTeachers}
            defaultValues={{
              name: subject.name,
              code: subject.code,
              description: subject.description,
              classIds: subject.classes?.map((c) => c.id) || [],
              teacherIds: subject.teachers?.map((t) => t.id) || [],
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Update Subject"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
