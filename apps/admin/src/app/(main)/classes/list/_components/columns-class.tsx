"use client";

import { ClassDto, ClassLevel, ClassStatus } from "@repo/shared-types";
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
import { Archive, MoreHorizontal, Pencil, Users } from "lucide-react";

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
  onEdit: (classData: ClassDto) => void;
  onArchive: (id: number) => void;
}

function ColumnActions({ row, onEdit, onArchive }: ColumnActionsProps) {
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
          onClick={() => onArchive(row.id)}
          className="text-destructive focus:text-destructive"
        >
          <Archive className="mr-2 size-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createClassTableColumns(
  onEdit: (classData: ClassDto) => void,
  onArchive: (id: number) => void,
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
      accessorKey: "sections",
      header: "Sections",
      cell: ({ row }) => {
        const sections = row.original.sections || [];
        return (
          <Badge variant="outline">
            {sections.length} {sections.length === 1 ? "Section" : "Sections"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalCapacity",
      header: "Capacity",
      cell: ({ row }) => {
        const current = row.original.totalStudentCount || 0;
        const capacity = row.original.totalCapacity || 0;
        const percentage =
          capacity > 0 ? Math.round((current / capacity) * 100) : 0;
        const isNearFull = percentage >= 80;
        const isFull = percentage >= 100;

        return (
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground size-4" />
            <span
              className={
                isFull ? "text-destructive" : isNearFull ? "text-warning" : ""
              }
            >
              {current}/{capacity}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "success" | "destructive" | "secondary" =
          "default";

        if (status === ClassStatus.ACTIVE) {
          variant = "success";
        } else if (status === ClassStatus.ARCHIVED) {
          variant = "secondary";
        } else if (status === ClassStatus.INACTIVE) {
          variant = "destructive";
        }

        return <Badge variant={variant}>{status}</Badge>;
      },
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
        <ColumnActions
          row={row.original}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ),
    },
  ];
}
