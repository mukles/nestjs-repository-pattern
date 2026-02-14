import { getClassById, getSectionRoutine } from "@/actions/classes";
import { ClassLevel, RoutinePeriodDto } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoutineGrid } from "./_components/routine-grid";

const levelLabels: Record<ClassLevel, string> = {
  [ClassLevel.NURSERY]: "Nursery",
  [ClassLevel.KINDERGARTEN]: "Kindergarten",
  [ClassLevel.PRIMARY]: "Primary",
  [ClassLevel.MIDDLE]: "Middle School",
  [ClassLevel.SECONDARY]: "Secondary",
  [ClassLevel.HIGHER_SECONDARY]: "Higher Secondary",
};

interface SectionDetailPageProps {
  params: Promise<{ id: string; sectionId: string }>;
}

export default async function SectionDetailPage({
  params,
}: SectionDetailPageProps) {
  const { id, sectionId } = await params;
  const classId = parseInt(id, 10);
  const sectionIdNum = parseInt(sectionId, 10);

  if (isNaN(classId) || isNaN(sectionIdNum)) {
    notFound();
  }

  const classResult = await getClassById(classId);

  if (!classResult.success) {
    notFound();
  }

  const classData = classResult.data;
  const section = classData.sections?.find((s) => s.id === sectionIdNum);

  if (!section) {
    notFound();
  }

  const routineResult = await getSectionRoutine(sectionIdNum);
  const routine = routineResult.data;

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/classes/${classId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {classData.name} - Section {section.name}
            </h2>
            <Badge variant="outline">
              {levelLabels[classData.level] || classData.level}
            </Badge>
            <Badge variant="secondary">{classData.academicYear}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            View and manage the class routine for this section.
          </p>
        </div>
      </div>

      {/* Section Info */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Class Teacher
          </div>
          <div className="mt-1 text-lg font-semibold">
            {section.classTeacher
              ? `${section.classTeacher.firstName} ${section.classTeacher.lastName}`
              : "Not assigned"}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Capacity
          </div>
          <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
            <Users className="text-muted-foreground size-4" />
            {section.currentStudentCount} / {section.capacity}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Subjects
          </div>
          <div className="mt-1 text-lg font-semibold">
            {section.subjectTeachers?.length || 0}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Periods/Day
          </div>
          <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
            <Calendar className="text-muted-foreground size-4" />
            {routine.periods.filter((p: RoutinePeriodDto) => !p.isBreak).length}
          </div>
        </div>
      </div>

      {/* Routine Header */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Class Routine</h3>
          <p className="text-muted-foreground text-sm">
            Weekly timetable showing subjects and teachers for each period.
          </p>
        </div>
      </div>

      {/* Routine Grid */}
      <div className="mt-4 flex-1 overflow-auto">
        <RoutineGrid routine={routine} sectionId={sectionIdNum} />
      </div>
    </div>
  );
}
