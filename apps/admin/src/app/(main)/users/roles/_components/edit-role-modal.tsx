"use client";

import { PermissionDto, RoleDto } from "@repo/shared-types";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/ui-kit/tooltip";
import { Edit } from "lucide-react";
import { useState } from "react";
import { RoleForm } from "./role-form";

interface EditRoleModalProps {
  role: RoleDto;
  permissions: PermissionDto[];
  isSystemRole?: boolean;
}

export function EditRoleModal({
  role,
  permissions,
  isSystemRole,
}: EditRoleModalProps) {
  const [open, setOpen] = useState(false);

  if (isSystemRole) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block" tabIndex={0}>
            <Button
              disabled
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>System generated roles cannot be edited</p>
        </TooltipContent>
      </Tooltip>
    );
  }

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
          <RoleForm initialData={role} permissions={permissions} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
