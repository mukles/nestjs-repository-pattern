import { Gender } from "./student-gender.enum";
import { StudentStatus } from "./student-status.enum";

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
