"use client";

import { deleteRole } from "@/actions/roles";
import { useMutation } from "@/hooks/use-mutation";
import { RoleDto } from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui-kit/dialog";
import { useDialog } from "@repo/ui/hooks/use-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteRoleDialogProps {
  role: RoleDto;
}

export function DeleteRoleDialog({ role }: DeleteRoleDialogProps) {
  const { isOpen, openChange } = useDialog();
  const { action, isPending } = useMutation(deleteRole, {
    onSuccess: () => {
      toast.success(`Role "${role.name}" has been deleted.`);
      openChange(false);
    },
    onError: () => {
      toast.error(`Failed to delete role "${role.name}". Please try again.`);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role{" "}
            <span className="font-semibold text-neutral-900">
              &quot;{role.name}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <form action={action}>
            <input type="hidden" name="id" value={role.id} />
            <Button
              type="button"
              variant="outline"
              onClick={() => openChange(false)}
              disabled={isPending}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Role"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
