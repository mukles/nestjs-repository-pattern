import { StudentDto, StudentStatus } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Eye } from "lucide-react";
import Link from "next/link";

export const studentTableColumns: ColumnDef<StudentDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link
        href={`/students/${row.original.id}`}
        className="text-primary font-medium hover:underline"
      >
        #{row.original.id}
      </Link>
    ),
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/students/${row.original.id}`}>
            <Eye className="mr-1 size-4" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/students/${row.original.id}`}>
            <Calendar className="mr-1 size-4" />
            Routine
          </Link>
        </Button>
      </div>
    ),
  },
];
