"use client";

import { PermissionData, Role } from "@/actions/roles";
import { DataTable } from "@repo/ui/components/data-table/data-table";
import { DataTablePagination } from "@repo/ui/components/data-table/data-table-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import { useDataTableInstance } from "@repo/ui/hooks/use-data-table-instance";
import { getRoleTableColumns } from "./columns-role";

interface RoleDataTableProps {
  data: Role[];
  permissions: PermissionData[];
}

export function RoleDataTable({ data, permissions }: RoleDataTableProps) {
  const columns = getRoleTableColumns(permissions);
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            Manage system roles and their assigned permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={columns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
