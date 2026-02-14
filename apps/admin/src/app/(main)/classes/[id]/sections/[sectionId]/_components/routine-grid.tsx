"use client";

import {
  DayOfWeek,
  DayOfWeekLabels,
  RoutinePeriodDto,
  RoutineSlotDto,
  SectionRoutineDto,
} from "@repo/shared-types";
import { useState } from "react";
import { EditSlotModal } from "./edit-slot-modal";
import { RoutineSlotCard } from "./routine-slot-card";

// Working days (Sunday to Thursday)
const displayDays: DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
];

interface RoutineGridProps {
  routine: SectionRoutineDto;
  sectionId: number;
}

export function RoutineGrid({ routine, sectionId }: RoutineGridProps) {
  const [editingSlot, setEditingSlot] = useState<{
    slot: RoutineSlotDto | null;
    periodId: number;
    day: DayOfWeek;
  } | null>(null);

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

  const handleSlotClick = (
    slot: RoutineSlotDto | undefined,
    period: RoutinePeriodDto,
    day: DayOfWeek,
  ) => {
    if (period.isBreak) return;
    setEditingSlot({
      slot: slot || null,
      periodId: period.id,
      day,
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="bg-muted/50 border p-3 text-left text-sm font-semibold">
                Period / Time
              </th>
              {displayDays.map((day) => (
                <th
                  key={day}
                  className="bg-muted/50 border p-3 text-center text-sm font-semibold"
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
                <td
                  className={`border p-2 ${period.isBreak ? "bg-amber-50 dark:bg-amber-950/30" : "bg-muted/30"}`}
                >
                  <div className="flex flex-col">
                    {period.isBreak ? (
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        {period.breakLabel || "Break"}
                      </span>
                    ) : (
                      <span className="text-sm font-medium">
                        Period {period.periodNumber}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {period.startTime} - {period.endTime}
                    </span>
                  </div>
                </td>

                {/* Day slots */}
                {displayDays.map((day) => {
                  const slot = getSlot(period.id, day);

                  if (period.isBreak) {
                    return (
                      <td
                        key={`${period.id}-${day}`}
                        className="border bg-amber-50 p-2 text-center dark:bg-amber-950/30"
                      >
                        <span className="text-muted-foreground text-xs italic">
                          {period.breakLabel || "Break"}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`${period.id}-${day}`}
                      className="hover:bg-accent/50 cursor-pointer border p-1 transition-colors"
                      onClick={() => handleSlotClick(slot, period, day)}
                    >
                      <RoutineSlotCard slot={slot} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingSlot && (
        <EditSlotModal
          open={true}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingSlot(null);
          }}
          slot={editingSlot.slot}
          periodId={editingSlot.periodId}
          day={editingSlot.day}
          sectionId={sectionId}
        />
      )}
    </>
  );
}
