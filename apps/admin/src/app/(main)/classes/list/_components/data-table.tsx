"use client";

import { archiveClass } from "@/actions/classes";
import { ClassDto } from "@repo/shared-types";
import { DataTable } from "@repo/ui/components/data-table/data-table";
import { DataTablePagination } from "@repo/ui/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@repo/ui/components/data-table/data-table-view-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui-kit/alert-dialog";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import { useDataTableInstance } from "@repo/ui/hooks/use-data-table-instance";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createClassTableColumns } from "./columns-class";
import { EditClassModal } from "./edit-class-modal";

interface TableCardsProps {
  data: ClassDto[];
}

export function TableCards({ data }: TableCardsProps) {
  const router = useRouter();
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [archivingClassId, setArchivingClassId] = useState<number | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleEdit = (classData: ClassDto) => {
    setEditingClass(classData);
  };

  const handleArchive = (id: number) => {
    setArchivingClassId(id);
  };

  const confirmArchive = async () => {
    if (!archivingClassId) return;

    setIsArchiving(true);
    try {
      const result = await archiveClass(archivingClassId);
      if (result.success) {
        toast.success("Class archived successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to archive class");
      }
    } catch {
      toast.error("An error occurred while archiving the class");
    } finally {
      setIsArchiving(false);
      setArchivingClassId(null);
    }
  };

  const columns = useMemo(
    () => createClassTableColumns(handleEdit, handleArchive),
    [],
  );

  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              Manage your classes, sections, and teacher assignments.
            </CardDescription>
            <CardAction>
              <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />
                <Button variant="outline" size="sm">
                  <Download />
                  <span className="hidden lg:inline">Export</span>
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="flex size-full flex-col gap-4">
            <div className="overflow-hidden rounded-md border">
              <DataTable table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <EditClassModal
        classData={editingClass}
        open={!!editingClass}
        onOpenChange={(open: boolean) => !open && setEditingClass(null)}
      />

      {/* Archive Confirmation */}
      <AlertDialog
        open={!!archivingClassId}
        onOpenChange={(open) => !open && setArchivingClassId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this class? The class data will
              be preserved and can be restored later. Students will need to be
              reassigned to other classes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmArchive}
              disabled={isArchiving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isArchiving ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
