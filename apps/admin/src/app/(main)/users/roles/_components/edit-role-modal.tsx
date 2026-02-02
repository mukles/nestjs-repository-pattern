"use client";

import { PermissionData, Role, updateRole } from "@/actions/roles";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui-kit/dialog";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoleForm } from "./role-form";

interface EditRoleModalProps {
  role: Role;
  permissions: PermissionData[];
}

export function EditRoleModal({ role, permissions }: EditRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsPending(true);
    try {
      const result = await updateRole(role.id, data);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        alert(result.error?.message || "Failed to update role");
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
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Edit className="size-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Role: {role.name}
          </DialogTitle>
          <DialogDescription>
            Modify the role details and adjust its permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RoleForm
            initialData={role}
            permissions={permissions}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
