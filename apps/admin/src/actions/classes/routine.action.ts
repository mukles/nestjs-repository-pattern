"use server";

import { fakeSubjects, fakeTeachers } from "@/data/fake-classes";
import {
  CreateRoutinePeriodDto,
  CreateRoutineSlotDto,
  DayOfWeek,
  RoutinePeriodDto,
  RoutineSlotDto,
  SectionRoutineDto,
  UpdateRoutinePeriodDto,
  UpdateRoutineSlotDto,
} from "@repo/shared-types";

// Default periods for a school day
const defaultPeriods: RoutinePeriodDto[] = [
  { id: 1, periodNumber: 1, startTime: "08:00", endTime: "08:45" },
  { id: 2, periodNumber: 2, startTime: "08:45", endTime: "09:30" },
  { id: 3, periodNumber: 3, startTime: "09:30", endTime: "10:15" },
  {
    id: 4,
    periodNumber: 4,
    startTime: "10:15",
    endTime: "10:30",
    isBreak: true,
    breakLabel: "Short Break",
  },
  { id: 5, periodNumber: 5, startTime: "10:30", endTime: "11:15" },
  { id: 6, periodNumber: 6, startTime: "11:15", endTime: "12:00" },
  {
    id: 7,
    periodNumber: 7,
    startTime: "12:00",
    endTime: "12:45",
    isBreak: true,
    breakLabel: "Lunch Break",
  },
  { id: 8, periodNumber: 8, startTime: "12:45", endTime: "13:30" },
  { id: 9, periodNumber: 9, startTime: "13:30", endTime: "14:15" },
  { id: 10, periodNumber: 10, startTime: "14:15", endTime: "15:00" },
];

// Working days (excluding Saturday and Sunday for demo)
const workingDays: DayOfWeek[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
];

// Store for routine data (in-memory for fake implementation)
const routineStore: Map<number, SectionRoutineDto> = new Map();

// Generate fake routine slots for a section
function generateFakeSlots(sectionId: number): RoutineSlotDto[] {
  const slots: RoutineSlotDto[] = [];
  let slotId = 1;

  // Get non-break periods
  const teachingPeriods = defaultPeriods.filter((p) => !p.isBreak);
  const subjects = fakeSubjects.slice(0, 6); // Use first 6 subjects

  for (const day of workingDays) {
    for (const period of teachingPeriods) {
      // Randomly assign subject and teacher
      const subjectIndex = (slotId + period.id) % subjects.length;
      const teacherIndex = (slotId + period.id + 1) % fakeTeachers.length;

      slots.push({
        id: slotId++,
        sectionId,
        periodId: period.id,
        day,
        subject: subjects[subjectIndex],
        teacher: fakeTeachers[teacherIndex],
        room: `Room ${100 + (slotId % 10)}`,
      });
    }
  }

  return slots;
}

// Initialize routine for a section if not exists
function initializeRoutine(sectionId: number): SectionRoutineDto {
  if (!routineStore.has(sectionId)) {
    routineStore.set(sectionId, {
      sectionId,
      periods: [...defaultPeriods],
      slots: generateFakeSlots(sectionId),
    });
  }
  return routineStore.get(sectionId)!;
}

export async function getSectionRoutine(sectionId: number): Promise<{
  success: true;
  data: SectionRoutineDto;
}> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const routine = initializeRoutine(sectionId);
  return {
    success: true,
    data: routine,
  };
}

export async function createRoutinePeriod(
  sectionId: number,
  data: CreateRoutinePeriodDto,
): Promise<
  | { success: true; data: RoutinePeriodDto }
  | { success: false; error: { message: string } }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);

  // Generate new ID
  const newId =
    Math.max(...routine.periods.map((p: RoutinePeriodDto) => p.id), 0) + 1;

  const newPeriod: RoutinePeriodDto = {
    id: newId,
    periodNumber: data.periodNumber,
    startTime: data.startTime,
    endTime: data.endTime,
    isBreak: data.isBreak,
    breakLabel: data.breakLabel,
  };

  routine.periods.push(newPeriod);
  routine.periods.sort(
    (a: RoutinePeriodDto, b: RoutinePeriodDto) =>
      a.periodNumber - b.periodNumber,
  );

  return {
    success: true,
    data: newPeriod,
  };
}

export async function updateRoutinePeriod(
  sectionId: number,
  periodId: number,
  data: UpdateRoutinePeriodDto,
): Promise<
  | { success: true; data: RoutinePeriodDto }
  | { success: false; error: { message: string } }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);
  const periodIndex = routine.periods.findIndex(
    (p: RoutinePeriodDto) => p.id === periodId,
  );

  if (periodIndex === -1) {
    return {
      success: false,
      error: { message: "Period not found" },
    };
  }

  const period = routine.periods[periodIndex]!;
  routine.periods[periodIndex] = {
    ...period,
    startTime: data.startTime ?? period.startTime,
    endTime: data.endTime ?? period.endTime,
    isBreak: data.isBreak ?? period.isBreak,
    breakLabel: data.breakLabel ?? period.breakLabel,
  };

  return {
    success: true,
    data: routine.periods[periodIndex]!,
  };
}

export async function deleteRoutinePeriod(
  sectionId: number,
  periodId: number,
): Promise<{ success: true } | { success: false; error: { message: string } }> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);
  const periodIndex = routine.periods.findIndex(
    (p: RoutinePeriodDto) => p.id === periodId,
  );

  if (periodIndex === -1) {
    return {
      success: false,
      error: { message: "Period not found" },
    };
  }

  // Remove all slots for this period
  routine.slots = routine.slots.filter(
    (s: RoutineSlotDto) => s.periodId !== periodId,
  );
  routine.periods.splice(periodIndex, 1);

  return { success: true };
}

export async function createRoutineSlot(
  sectionId: number,
  data: CreateRoutineSlotDto,
): Promise<
  | { success: true; data: RoutineSlotDto }
  | { success: false; error: { message: string } }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);

  // Check if slot already exists for this period and day
  const existingSlot = routine.slots.find(
    (s: RoutineSlotDto) => s.periodId === data.periodId && s.day === data.day,
  );

  if (existingSlot) {
    return {
      success: false,
      error: { message: "A slot already exists for this period and day" },
    };
  }

  const subject = fakeSubjects.find((s) => s.id === data.subjectId);
  const teacher = fakeTeachers.find((t) => t.id === data.teacherId);

  if (!subject) {
    return {
      success: false,
      error: { message: "Subject not found" },
    };
  }

  if (!teacher) {
    return {
      success: false,
      error: { message: "Teacher not found" },
    };
  }

  const newId =
    Math.max(...routine.slots.map((s: RoutineSlotDto) => s.id), 0) + 1;

  const newSlot: RoutineSlotDto = {
    id: newId,
    sectionId,
    periodId: data.periodId,
    day: data.day,
    subject,
    teacher,
    room: data.room,
  };

  routine.slots.push(newSlot);

  return {
    success: true,
    data: newSlot,
  };
}

export async function updateRoutineSlot(
  sectionId: number,
  slotId: number,
  data: UpdateRoutineSlotDto,
): Promise<
  | { success: true; data: RoutineSlotDto }
  | { success: false; error: { message: string } }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);
  const slotIndex = routine.slots.findIndex(
    (s: RoutineSlotDto) => s.id === slotId,
  );

  if (slotIndex === -1) {
    return {
      success: false,
      error: { message: "Slot not found" },
    };
  }

  const slot = routine.slots[slotIndex]!;
  let subject = slot.subject;
  let teacher = slot.teacher;

  if (data.subjectId !== undefined) {
    const foundSubject = fakeSubjects.find((s) => s.id === data.subjectId);
    if (!foundSubject) {
      return {
        success: false,
        error: { message: "Subject not found" },
      };
    }
    subject = foundSubject;
  }

  if (data.teacherId !== undefined) {
    const foundTeacher = fakeTeachers.find((t) => t.id === data.teacherId);
    if (!foundTeacher) {
      return {
        success: false,
        error: { message: "Teacher not found" },
      };
    }
    teacher = foundTeacher;
  }

  routine.slots[slotIndex] = {
    ...slot,
    subject,
    teacher,
    room: data.room ?? slot.room,
  };

  return {
    success: true,
    data: routine.slots[slotIndex]!,
  };
}

export async function deleteRoutineSlot(
  sectionId: number,
  slotId: number,
): Promise<{ success: true } | { success: false; error: { message: string } }> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routine = initializeRoutine(sectionId);
  const slotIndex = routine.slots.findIndex(
    (s: RoutineSlotDto) => s.id === slotId,
  );

  if (slotIndex === -1) {
    return {
      success: false,
      error: { message: "Slot not found" },
    };
  }

  routine.slots.splice(slotIndex, 1);

  return { success: true };
}

// Get available subjects for dropdown
export async function getAvailableSubjects(): Promise<{
  success: true;
  data: { id: number; name: string; code: string }[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    success: true,
    data: fakeSubjects.map((s) => ({ id: s.id, name: s.name, code: s.code })),
  };
}
