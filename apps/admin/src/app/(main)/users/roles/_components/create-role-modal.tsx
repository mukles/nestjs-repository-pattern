"use client";

import { createRole, PermissionData } from "@/actions/roles";
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
import { RoleForm } from "./role-form";

interface CreateRoleModalProps {
  permissions: PermissionData[];
}

export function CreateRoleModal({ permissions }: CreateRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsPending(true);
    try {
      const result = await createRole(data);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        alert(result.error?.message || "Failed to create role");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          className="px-4 py-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Add Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Role
          </DialogTitle>
          <DialogDescription>
            Define a new role and assign its specific permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RoleForm
            permissions={permissions}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
