"use server";

import { fakeStudents, StudentWithEnrollment } from "@/data/fake-students";
import { Gender, StudentDto, StudentStatus } from "@repo/shared-types";
import { revalidatePath } from "next/cache";

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  status?: StudentStatus;
  classId?: number;
  sectionId?: number;
}

// Update student
export async function updateStudent(
  studentId: number,
  data: UpdateStudentDto,
): Promise<
  | { success: true; data: StudentWithEnrollment }
  | { success: false; error: { message: string } }
> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const studentIndex = fakeStudents.findIndex(
    (s: StudentWithEnrollment) => s.id === studentId,
  );

  if (studentIndex === -1) {
    return {
      success: false,
      error: { message: "Student not found" },
    };
  }

  const student = fakeStudents[studentIndex]!;

  // Update the student
  const updatedStudent: StudentWithEnrollment = {
    ...student,
    firstName: data.firstName ?? student.firstName,
    lastName: data.lastName ?? student.lastName,
    email: data.email ?? student.email,
    dateOfBirth: data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : student.dateOfBirth,
    gender: data.gender ?? student.gender,
    status: data.status ?? student.status,
    updatedAt: new Date(),
  };

  fakeStudents[studentIndex] = updatedStudent;

  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);

  return {
    success: true,
    data: updatedStudent,
  };
}

// Delete student
export async function deleteStudent(
  studentId: number,
): Promise<{ success: true } | { success: false; error: { message: string } }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const studentIndex = fakeStudents.findIndex(
    (s: StudentWithEnrollment) => s.id === studentId,
  );

  if (studentIndex === -1) {
    return {
      success: false,
      error: { message: "Student not found" },
    };
  }

  fakeStudents.splice(studentIndex, 1);

  revalidatePath("/students");

  return { success: true };
}

// Change student status
export async function updateStudentStatus(
  studentId: number,
  status: StudentStatus,
): Promise<
  | { success: true; data: StudentDto }
  | { success: false; error: { message: string } }
> {
  return updateStudent(studentId, { status });
}
