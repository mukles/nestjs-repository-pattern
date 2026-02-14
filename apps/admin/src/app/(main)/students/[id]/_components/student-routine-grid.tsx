"use client";

import {
  DayOfWeek,
  DayOfWeekLabels,
  RoutineSlotDto,
  SectionRoutineDto,
} from "@repo/shared-types";
import { cn } from "@repo/ui/lib/utils";
import { Clock } from "lucide-react";

// Working days (Sunday to Thursday)
const displayDays: DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
];

interface StudentRoutineGridProps {
  routine: SectionRoutineDto;
  className?: string;
}

export function StudentRoutineGrid({
  routine,
  className,
}: StudentRoutineGridProps) {
  const { periods, slots } = routine;

  // Sort periods by period number
  const sortedPeriods = [...periods].sort(
    (a, b) => a.periodNumber - b.periodNumber,
  );

  // Get slot for a specific period and day
  const getSlot = (
    periodId: number,
    day: DayOfWeek,
  ): RoutineSlotDto | undefined => {
    return slots.find(
      (s: RoutineSlotDto) => s.periodId === periodId && s.day === day,
    );
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-muted/50 text-muted-foreground min-w-[100px] border p-3 text-left text-sm font-medium">
              Period / Time
            </th>
            {displayDays.map((day) => (
              <th
                key={day}
                className="bg-muted/50 text-muted-foreground min-w-[140px] border p-3 text-center text-sm font-medium"
              >
                {DayOfWeekLabels[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPeriods.map((period) => (
            <tr key={period.id}>
              {/* Period info */}
              <td className="bg-muted/30 border p-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {period.isBreak
                      ? period.breakLabel || "Break"
                      : `Period ${period.periodNumber}`}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-3" />
                    {period.startTime} - {period.endTime}
                  </span>
                </div>
              </td>

              {/* Slots for each day */}
              {displayDays.map((day) => {
                const slot = getSlot(period.id, day);

                if (period.isBreak) {
                  return (
                    <td
                      key={`${period.id}-${day}`}
                      className="bg-muted/20 border p-2"
                    >
                      <div className="flex h-16 items-center justify-center">
                        <span className="text-muted-foreground text-xs italic">
                          {period.breakLabel || "Break"}
                        </span>
                      </div>
                    </td>
                  );
                }

                return (
                  <td key={`${period.id}-${day}`} className="border p-2">
                    {slot ? (
                      <div className="bg-primary/5 border-primary/20 flex h-16 flex-col justify-center rounded-md border p-2">
                        <div className="text-primary text-sm font-medium">
                          {slot.subject?.name || "Subject"}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {slot.teacher?.firstName} {slot.teacher?.lastName}
                        </div>
                        {slot.room && (
                          <div className="text-muted-foreground text-xs">
                            Room: {slot.room}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-16 items-center justify-center">
                        <span className="text-muted-foreground text-xs">-</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
