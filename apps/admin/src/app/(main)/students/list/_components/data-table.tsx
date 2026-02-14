"use client";

import { deleteStudent } from "@/actions/students/update-student.action";
import { StudentDto } from "@repo/shared-types";
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
import { createStudentTableColumns } from "./columns-student";
import { EditStudentModal } from "./edit-student-modal";

interface TableCardsProps {
  data: StudentDto[];
}

export function TableCards({ data }: TableCardsProps) {
  const router = useRouter();
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (student: StudentDto) => {
    setEditingStudent(student);
  };

  const handleDelete = (id: number) => {
    setDeletingStudentId(id);
  };

  const confirmDelete = async () => {
    if (!deletingStudentId) return;

    setIsDeleting(true);
    try {
      const result = await deleteStudent(deletingStudentId);
      if (result.success) {
        toast.success("Student deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to delete student");
      }
    } catch {
      toast.error("An error occurred while deleting the student");
    } finally {
      setIsDeleting(false);
      setDeletingStudentId(null);
    }
  };

  const columns = useMemo(
    () => createStudentTableColumns(handleEdit, handleDelete),
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
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Here's a list of students in the system!
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
      <EditStudentModal
        student={editingStudent}
        open={editingStudent !== null}
        onOpenChange={(open) => {
          if (!open) setEditingStudent(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingStudentId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingStudentId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
