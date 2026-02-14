import { getClassById } from "@/actions/classes";
import { ClassLevel } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateSectionModal } from "./_components/create-section-modal";
import { SectionList } from "./_components/section-list";

const levelLabels: Record<ClassLevel, string> = {
  [ClassLevel.NURSERY]: "Nursery",
  [ClassLevel.KINDERGARTEN]: "Kindergarten",
  [ClassLevel.PRIMARY]: "Primary",
  [ClassLevel.MIDDLE]: "Middle School",
  [ClassLevel.SECONDARY]: "Secondary",
  [ClassLevel.HIGHER_SECONDARY]: "Higher Secondary",
};

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({
  params,
}: ClassDetailPageProps) {
  const { id } = await params;
  const classId = parseInt(id, 10);

  if (isNaN(classId)) {
    notFound();
  }

  const result = await getClassById(classId);

  if (!result.success) {
    notFound();
  }

  const classData = result.data;

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/classes/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {classData.name}
            </h2>
            <Badge variant="outline">
              {levelLabels[classData.level] || classData.level}
            </Badge>
            <Badge variant="secondary">{classData.academicYear}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage sections, capacity, and teacher assignments for this class.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Total Sections
          </div>
          <div className="mt-1 text-2xl font-bold">
            {classData.sections?.length || 0}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Total Capacity
          </div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-bold">
            <Users className="text-muted-foreground size-5" />
            {classData.totalCapacity || 0}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">
            Current Students
          </div>
          <div className="mt-1 text-2xl font-bold">
            {classData.totalStudentCount || 0} / {classData.totalCapacity || 0}
          </div>
        </div>
      </div>

      {/* Sections Header */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sections</h3>
          <p className="text-muted-foreground text-sm">
            View and manage sections for this class.
          </p>
        </div>
        <CreateSectionModal classId={classId} />
      </div>

      {/* Sections List */}
      <div className="mt-4 flex-1">
        <SectionList sections={classData.sections || []} classId={classId} />
      </div>
    </div>
  );
}
