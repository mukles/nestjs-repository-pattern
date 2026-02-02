"use client";

import { useState } from "react";
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
import { StudentForm } from "./student-form";
import { useRouter } from "next/navigation";

export function CreateStudentModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          className="px-4 py-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Student
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new student to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StudentForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
