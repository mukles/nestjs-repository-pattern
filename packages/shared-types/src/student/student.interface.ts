import { Pagination } from "../core/pagination/pagination.interface.js";
import { Gender } from "./student-gender.enum.js";
import { StudentStatus } from "./student-status.enum.js";

export interface StudentDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: Gender;
  status: StudentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetStudentsParams extends Pagination {
  email?: string;
  name?: string;
  sortBy?: keyof StudentDto;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: Gender;
  status?: StudentStatus;
  photo?: string;
  fatherId?: number;
  motherId?: number;
  guardianId?: number;
  guardianRelation?: string;
  isOrphan?: boolean;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  status?: StudentStatus;
  photo?: string;
  fatherId?: number;
  motherId?: number;
  guardianId?: number;
  guardianRelation?: string;
  isOrphan?: boolean;
}
