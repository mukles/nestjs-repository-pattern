"use client";

import { deleteSection } from "@/actions/classes";
import { SectionDto } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui-kit/dropdown-menu";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EditSectionModal } from "./edit-section-modal";

interface SectionCardProps {
  section: SectionDto;
  classId: number;
}

export function SectionCard({ section, classId }: SectionCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const capacityPercentage =
    section.capacity > 0
      ? Math.round((section.currentStudentCount / section.capacity) * 100)
      : 0;
  const isNearFull = capacityPercentage >= 80;
  const isFull = capacityPercentage >= 100;

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete section "${section.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteSection(classId, section.id);
      if (result.success) {
        toast.success("Section deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to delete section");
      }
    } catch {
      toast.error("An error occurred while deleting the section");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Section {section.name}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={isDeleting}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                  <Pencil className="mr-2 size-4" />
                  Edit Section
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Capacity */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="size-4" />
                Capacity
              </span>
              <span
                className={
                  isFull
                    ? "font-medium text-red-500"
                    : isNearFull
                      ? "font-medium text-amber-500"
                      : "font-medium"
                }
              >
                {section.currentStudentCount} / {section.capacity}
              </span>
            </div>
            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full transition-all ${isFull ? "bg-red-500" : isNearFull ? "bg-amber-500" : "bg-primary"}`}
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Class Teacher */}
          <div className="flex items-center gap-2">
            <UserCircle className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm">
              Class Teacher:
            </span>
            {section.classTeacher ? (
              <span className="text-sm font-medium">
                {section.classTeacher.firstName} {section.classTeacher.lastName}
              </span>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Not assigned
              </Badge>
            )}
          </div>

          {/* Subject Teachers */}
          <div>
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
              <BookOpen className="size-4" />
              Subject Teachers ({section.subjectTeachers?.length || 0})
            </div>
            {section.subjectTeachers && section.subjectTeachers.length > 0 ? (
              <div className="space-y-1.5 pl-6">
                {section.subjectTeachers.slice(0, 3).map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {st.subject.name}
                    </span>
                    <span className="font-medium">
                      {st.teacher.firstName} {st.teacher.lastName}
                    </span>
                  </div>
                ))}
                {section.subjectTeachers.length > 3 && (
                  <div className="text-muted-foreground text-xs">
                    +{section.subjectTeachers.length - 3} more subjects
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground pl-6 text-sm">
                No subjects assigned
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t pt-3">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={`/classes/${classId}/sections/${section.id}`}>
                <Calendar className="mr-2 size-4" />
                Routine
              </a>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={`/students/list?sectionId=${section.id}`}>
                <GraduationCap className="mr-2 size-4" />
                Students
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditSectionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        section={section}
        classId={classId}
      />
    </>
  );
}
