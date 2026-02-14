"use client";

import { ClassDto, ClassLevel } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui-kit/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, RotateCcw, Users } from "lucide-react";

const levelLabels: Record<ClassLevel, string> = {
  [ClassLevel.NURSERY]: "Nursery",
  [ClassLevel.KINDERGARTEN]: "Kindergarten",
  [ClassLevel.PRIMARY]: "Primary",
  [ClassLevel.MIDDLE]: "Middle School",
  [ClassLevel.SECONDARY]: "Secondary",
  [ClassLevel.HIGHER_SECONDARY]: "Higher Secondary",
};

interface ColumnActionsProps {
  row: ClassDto;
  onRestore: (id: number) => void;
}

function ColumnActions({ row, onRestore }: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRestore(row.id)}>
          <RotateCcw className="mr-2 size-4" />
          Restore
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createArchivedClassTableColumns(
  onRestore: (id: number) => void,
): ColumnDef<ClassDto>[] {
  return [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <Badge variant="outline">
          {levelLabels[row.original.level] || row.original.level}
        </Badge>
      ),
    },
    {
      accessorKey: "academicYear",
      header: "Academic Year",
      cell: ({ row }) => row.original.academicYear,
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const current = row.original.currentStudentCount || 0;
        const capacity = row.original.capacity;

        return (
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground size-4" />
            <span>
              {current}/{capacity}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "classTeacher",
      header: "Class Teacher",
      cell: ({ row }) => {
        const teacher = row.original.classTeacher;
        if (!teacher) {
          return <span className="text-muted-foreground">Not assigned</span>;
        }
        return `${teacher.firstName} ${teacher.lastName}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => <Badge variant="secondary">Archived</Badge>,
    },
    {
      accessorKey: "updatedAt",
      header: "Archived On",
      cell: ({ row }) =>
        row.original.updatedAt
          ? format(new Date(row.original.updatedAt), "dd-MMM-yyyy")
          : "",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ColumnActions row={row.original} onRestore={onRestore} />
      ),
    },
  ];
}
