import { Pagination } from "../core/pagination/pagination.interface.js";
import { SectionDto } from "../section/section.interface.js";
import { ClassLevel } from "./class-level.enum.js";
import { ClassStatus } from "./class-status.enum.js";

// TeacherDto is now in section.interface.ts, re-export for convenience
export type { TeacherDto } from "../section/section.interface.js";

export interface ClassDto {
  id: number;
  name: string;
  level: ClassLevel;
  academicYear: string;
  status: ClassStatus;
  sections: SectionDto[];
  // Computed fields
  totalCapacity: number;
  totalStudentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassDto {
  name: string;
  level: ClassLevel;
  academicYear: string;
}

export interface UpdateClassDto {
  name?: string;
  level?: ClassLevel;
  academicYear?: string;
  status?: ClassStatus;
}

export interface GetClassesParams extends Pagination {
  name?: string;
  level?: ClassLevel;
  academicYear?: string;
  status?: ClassStatus;
  sortBy?: keyof ClassDto;
}
