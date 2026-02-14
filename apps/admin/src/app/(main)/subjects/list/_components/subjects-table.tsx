"use client";

import { deleteSubject } from "@/actions/subjects";
import {
  ClassReference,
  SubjectDto,
  TeacherReference,
} from "@repo/shared-types";
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
import { createSubjectTableColumns } from "./columns-subject";
import { EditSubjectModal } from "./edit-subject-modal";

interface SubjectsTableProps {
  data: SubjectDto[];
  availableClasses: ClassReference[];
  availableTeachers: TeacherReference[];
}

export function SubjectsTable({
  data,
  availableClasses,
  availableTeachers,
}: SubjectsTableProps) {
  const router = useRouter();
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (subject: SubjectDto) => {
    setEditingSubject(subject);
  };

  const handleDelete = (id: number) => {
    setDeletingSubjectId(id);
  };

  const confirmDelete = async () => {
    if (!deletingSubjectId) return;

    setIsDeleting(true);
    try {
      const result = await deleteSubject(deletingSubjectId);
      if (result.success) {
        toast.success("Subject deactivated successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to deactivate subject");
      }
    } catch {
      toast.error("An error occurred while deactivating the subject");
    } finally {
      setIsDeleting(false);
      setDeletingSubjectId(null);
    }
  };

  const columns = useMemo(
    () => createSubjectTableColumns(handleEdit, handleDelete),
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
            <CardTitle>Subjects</CardTitle>
            <CardDescription>
              Manage the subjects available for assignment to class sections.
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
      <EditSubjectModal
        subject={editingSubject}
        availableClasses={availableClasses}
        availableTeachers={availableTeachers}
        open={!!editingSubject}
        onOpenChange={(open: boolean) => !open && setEditingSubject(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingSubjectId}
        onOpenChange={(open) => !open && setDeletingSubjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this subject? It will no
              longer be available for assignment to new sections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
