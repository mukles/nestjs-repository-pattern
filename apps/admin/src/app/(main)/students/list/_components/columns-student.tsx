import { StudentDto, StudentStatus } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const studentTableColumns: ColumnDef<StudentDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => row.original.firstName,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => row.original.lastName,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) =>
      row.original.dateOfBirth
        ? format(new Date(row.original.dateOfBirth), "dd-MMM-yyyy")
        : "",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "dd-MMM-yyyy")
        : "",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) =>
      row.original.updatedAt
        ? format(new Date(row.original.updatedAt), "dd-MMM-yyyy")
        : "",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      let variant: "default" | "success" | "destructive";

      if (row.original.status === StudentStatus.ACTIVE) {
        variant = "success";
      } else if (row.original.status === StudentStatus.BANNED) {
        variant = "destructive";
      } else if (row.original.status === StudentStatus.SUSPENDED) {
        variant = "destructive";
      }

      // @ts-ignore
      return <Badge variant={variant}>{row.original.status}</Badge>;
    },
  },
];
