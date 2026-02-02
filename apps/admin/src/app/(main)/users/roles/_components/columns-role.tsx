import { PermissionDto, RoleDto } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteRoleDialog } from "./delete-role-dialog";
import { EditRoleModal } from "./edit-role-modal";

export const getRoleTableColumns = (
  permissions: PermissionDto[],
): ColumnDef<RoleDto>[] => [
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => (
      <span className="font-medium text-neutral-700">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description || "-",
  },
  {
    accessorKey: "totalUsers",
    header: "Users",
    cell: ({ row }) => (
      <Badge variant="secondary" className="rounded-full">
        {row.original.totalUsers || 0}
      </Badge>
    ),
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const rolePermissions = row.original.permissions || [];
      return (
        <div className="flex flex-wrap gap-1">
          {rolePermissions.slice(0, 3).map((p) => (
            <Badge
              key={p.id}
              variant="secondary"
              className="px-1.5 py-0 text-[10px]"
            >
              {p.name}
            </Badge>
          ))}
          {rolePermissions.length > 3 && (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              +{rolePermissions.length - 3} more
            </Badge>
          )}
          {rolePermissions.length === 0 && (
            <span className="text-muted-foreground text-xs italic">
              No permissions
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      console.log("Row data:", row.original);
      return (
        <div className="flex justify-end gap-2">
          <EditRoleModal
            role={row.original}
            permissions={permissions}
            isSystemRole={row.original.isSystem}
          />
          <DeleteRoleDialog
            role={row.original}
            isSystemRole={row.original.isSystem}
          />
        </div>
      );
    },
  },
];
