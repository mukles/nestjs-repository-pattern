"use client";

import { SectionDto } from "@repo/shared-types";
import { SectionCard } from "./section-card";

interface SectionListProps {
  sections: SectionDto[];
  classId: number;
}

export function SectionList({ sections, classId }: SectionListProps) {
  if (sections.length === 0) {
    return (
      <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">No sections yet</p>
          <p className="mt-1 text-sm">
            Create your first section to manage students and teachers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} classId={classId} />
      ))}
    </div>
  );
}
