import { Pagination } from "../core/pagination/pagination.interface.js";
import { SubjectDto } from "../subject/subject.interface.js";

export interface TeacherDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SectionSubjectTeacherDto {
  id: number;
  subject: SubjectDto;
  teacher: TeacherDto;
}

export interface SectionDto {
  id: number;
  name: string; // A, B, C
  capacity: number;
  currentStudentCount: number;
  classTeacher?: TeacherDto;
  subjectTeachers: SectionSubjectTeacherDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSectionDto {
  name: string;
  capacity: number;
  classTeacherId?: number;
}

export interface UpdateSectionDto {
  name?: string;
  capacity?: number;
  classTeacherId?: number;
}

export interface AssignSubjectTeacherDto {
  sectionId: number;
  subjectId: number;
  teacherId: number;
}

export interface GetSectionsParams extends Pagination {
  classId?: number;
  name?: string;
  sortBy?: keyof SectionDto;
}
