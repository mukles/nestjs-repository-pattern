"use client";

import { RoutineSlotDto } from "@repo/shared-types";
import { BookOpen, MapPin, User } from "lucide-react";

interface RoutineSlotCardProps {
  slot?: RoutineSlotDto;
}

export function RoutineSlotCard({ slot }: RoutineSlotCardProps) {
  if (!slot || !slot.subject) {
    return (
      <div className="flex h-full min-h-[70px] items-center justify-center rounded border-2 border-dashed border-gray-200 p-2 dark:border-gray-700">
        <span className="text-muted-foreground text-xs">+ Add</span>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 hover:bg-primary/10 flex min-h-[70px] flex-col rounded border p-2 transition-colors">
      {/* Subject */}
      <div className="flex items-center gap-1">
        <BookOpen className="text-primary size-3" />
        <span className="text-primary text-sm font-semibold">
          {slot.subject.name}
        </span>
      </div>

      {/* Teacher */}
      {slot.teacher && (
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <User className="size-3" />
          <span>
            {slot.teacher.firstName} {slot.teacher.lastName}
          </span>
        </div>
      )}

      {/* Room */}
      {slot.room && (
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          <MapPin className="size-3" />
          <span>{slot.room}</span>
        </div>
      )}
    </div>
  );
}
