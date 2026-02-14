import { SubjectDto } from "../subject/subject.interface.js";
import { TeacherDto } from "./section.interface.js";

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export const DayOfWeek_VALUES = Object.values(DayOfWeek) as DayOfWeek[];

// Short labels for display
export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: "Sun",
  [DayOfWeek.MONDAY]: "Mon",
  [DayOfWeek.TUESDAY]: "Tue",
  [DayOfWeek.WEDNESDAY]: "Wed",
  [DayOfWeek.THURSDAY]: "Thu",
  [DayOfWeek.FRIDAY]: "Fri",
  [DayOfWeek.SATURDAY]: "Sat",
};

export const DayOfWeekFullLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: "Sunday",
  [DayOfWeek.MONDAY]: "Monday",
  [DayOfWeek.TUESDAY]: "Tuesday",
  [DayOfWeek.WEDNESDAY]: "Wednesday",
  [DayOfWeek.THURSDAY]: "Thursday",
  [DayOfWeek.FRIDAY]: "Friday",
  [DayOfWeek.SATURDAY]: "Saturday",
};

export interface RoutinePeriodDto {
  id: number;
  periodNumber: number;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isBreak?: boolean;
  breakLabel?: string; // e.g., "Lunch Break", "Recess"
}

export interface RoutineSlotDto {
  id: number;
  sectionId: number;
  periodId: number;
  day: DayOfWeek;
  subject?: SubjectDto;
  teacher?: TeacherDto;
  room?: string;
}

export interface SectionRoutineDto {
  sectionId: number;
  periods: RoutinePeriodDto[];
  slots: RoutineSlotDto[];
}

export interface CreateRoutineSlotDto {
  periodId: number;
  day: DayOfWeek;
  subjectId: number;
  teacherId: number;
  room?: string;
}

export interface UpdateRoutineSlotDto {
  subjectId?: number;
  teacherId?: number;
  room?: string;
}

export interface CreateRoutinePeriodDto {
  periodNumber: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakLabel?: string;
}

export interface UpdateRoutinePeriodDto {
  startTime?: string;
  endTime?: string;
  isBreak?: boolean;
  breakLabel?: string;
}
