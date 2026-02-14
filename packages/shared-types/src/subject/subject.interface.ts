import { Pagination } from "../core/pagination/pagination.interface.js";

// Lightweight class reference for subject associations
export interface ClassReference {
  id: number;
  name: string;
}

// Lightweight teacher reference for subject associations
export interface TeacherReference {
  id: number;
  firstName: string;
  lastName: string;
}

export interface SubjectDto {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  classes: ClassReference[]; // Classes this subject is assigned to
  teachers: TeacherReference[]; // Teachers who can teach this subject
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string;
  classIds?: number[]; // Optional class assignments
  teacherIds?: number[]; // Optional teacher assignments
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  classIds?: number[]; // Update class assignments
  teacherIds?: number[]; // Update teacher assignments
}

export interface GetSubjectsParams extends Pagination {
  name?: string;
  code?: string;
  classId?: number; // Filter by class
  teacherId?: number; // Filter by teacher
  isActive?: boolean;
  sortBy?: keyof SubjectDto;
}
