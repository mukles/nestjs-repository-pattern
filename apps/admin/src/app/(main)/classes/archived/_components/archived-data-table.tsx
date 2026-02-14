"use client";

import { restoreClass } from "@/actions/classes";
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
import { createArchivedClassTableColumns } from "./columns-archived-class";

interface ArchivedTableCardsProps {
  data: ClassDto[];
}

export function ArchivedTableCards({ data }: ArchivedTableCardsProps) {
  const router = useRouter();
  const [restoringClassId, setRestoringClassId] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = (id: number) => {
    setRestoringClassId(id);
  };

  const confirmRestore = async () => {
    if (!restoringClassId) return;

    setIsRestoring(true);
    try {
      const result = await restoreClass(restoringClassId);
      if (result.success) {
        toast.success("Class restored successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to restore class");
      }
    } catch {
      toast.error("An error occurred while restoring the class");
    } finally {
      setIsRestoring(false);
      setRestoringClassId(null);
    }
  };

  const columns = useMemo(
    () => createArchivedClassTableColumns(handleRestore),
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
            <CardTitle>Archived Classes</CardTitle>
            <CardDescription>
              Classes that have been archived from previous academic years.
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

      {/* Restore Confirmation */}
      <AlertDialog
        open={!!restoringClassId}
        onOpenChange={(open) => !open && setRestoringClassId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this class? The class will become
              active and available for student enrollment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore} disabled={isRestoring}>
              {isRestoring ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
