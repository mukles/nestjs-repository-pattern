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
