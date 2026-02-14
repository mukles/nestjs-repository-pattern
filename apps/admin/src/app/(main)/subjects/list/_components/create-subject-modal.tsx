"use client";

import { createSubject } from "@/actions/subjects";
import {
  ClassReference,
  CreateSubjectDto,
  TeacherReference,
} from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui-kit/dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SubjectForm } from "./subject-form";

interface CreateSubjectModalProps {
  availableClasses: ClassReference[];
  availableTeachers: TeacherReference[];
}

export function CreateSubjectModal({
  availableClasses,
  availableTeachers,
}: CreateSubjectModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreateSubjectDto) => {
    setIsSubmitting(true);
    try {
      const result = await createSubject(values);
      if (result.success) {
        toast.success("Subject created successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to create subject");
      }
    } catch {
      toast.error("An error occurred while creating the subject");
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
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Subject
          </DialogTitle>
          <DialogDescription>
            Add a new subject that can be assigned to class sections with
            teachers.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <SubjectForm
            availableClasses={availableClasses}
            availableTeachers={availableTeachers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Subject"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
