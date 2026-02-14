"use client";

import { StudentDto, StudentStatus } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui-kit/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ColumnActionsProps {
  row: StudentDto;
  onEdit: (student: StudentDto) => void;
  onDelete: (id: number) => void;
}

function ColumnActions({ row, onEdit, onDelete }: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/students/${row.id}`}>
            <Eye className="mr-2 size-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/students/${row.id}`}>
            <Calendar className="mr-2 size-4" />
            View Routine
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(row)}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createStudentTableColumns(
  onEdit: (student: StudentDto) => void,
  onDelete: (id: number) => void,
): ColumnDef<StudentDto>[] {
  return [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        let variant: "default" | "success" | "destructive" = "default";

        if (row.original.status === StudentStatus.ACTIVE) {
          variant = "success";
        } else if (
          row.original.status === StudentStatus.BANNED ||
          row.original.status === StudentStatus.SUSPENDED
        ) {
          variant = "destructive";
        }

        return <Badge variant={variant}>{row.original.status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ColumnActions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
