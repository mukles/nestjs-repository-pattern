"use client";

import { createClass } from "@/actions/classes";
import { ClassFormValues } from "@/lib/validation/class.schema";
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
import { ClassForm } from "./class-form";

export function CreateClassModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createClass(values);
      if (result.success) {
        toast.success("Class created successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to create class");
      }
    } catch {
      toast.error("An error occurred while creating the class");
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
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Class
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new class. You can add
            sections with capacity and teachers after creation.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <ClassForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Class"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
