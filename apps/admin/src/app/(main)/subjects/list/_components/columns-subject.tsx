"use client";

import { SubjectDto } from "@repo/shared-types";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ColumnActionsProps {
  row: SubjectDto;
  onEdit: (subject: SubjectDto) => void;
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
        <DropdownMenuItem onClick={() => onEdit(row)}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createSubjectTableColumns(
  onEdit: (subject: SubjectDto) => void,
  onDelete: (id: number) => void,
): ColumnDef<SubjectDto>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "Subject Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-1">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "classes",
      header: "Classes",
      cell: ({ row }) => {
        const classes = row.original.classes || [];
        if (classes.length === 0) {
          return <span className="text-muted-foreground">No classes</span>;
        }
        const displayClasses = classes.slice(0, 3);
        const remaining = classes.length - 3;
        return (
          <div className="flex flex-wrap gap-1">
            {displayClasses.map((c) => (
              <Badge key={c.id} variant="secondary" className="text-xs">
                {c.name}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remaining} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "teachers",
      header: "Teachers",
      cell: ({ row }) => {
        const teachers = row.original.teachers || [];
        if (teachers.length === 0) {
          return <span className="text-muted-foreground">No teachers</span>;
        }
        const displayTeachers = teachers.slice(0, 2);
        const remaining = teachers.length - 2;
        return (
          <div className="flex flex-wrap gap-1">
            {displayTeachers.map((t) => (
              <Badge key={t.id} variant="outline" className="text-xs">
                {t.firstName} {t.lastName}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{remaining} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        row.original.createdAt
          ? format(new Date(row.original.createdAt), "dd-MMM-yyyy")
          : "",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ColumnActions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
