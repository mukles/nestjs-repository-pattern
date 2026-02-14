"use server";

import {
  fakeStudents,
  getStudentById,
  StudentWithEnrollment,
} from "@/data/fake-students";

// Get student by ID with enrollment info
export async function getStudentWithEnrollment(
  studentId: number,
): Promise<
  | { success: true; data: StudentWithEnrollment }
  | { success: false; error: { message: string } }
> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const student = getStudentById(studentId);

  if (!student) {
    return {
      success: false,
      error: { message: "Student not found" },
    };
  }

  return {
    success: true,
    data: student,
  };
}

// Get all students with enrollment (for the list with filtering)
export async function getStudentsWithEnrollment(params?: {
  classId?: number;
  sectionId?: number;
  search?: string;
}): Promise<{
  success: true;
  data: StudentWithEnrollment[];
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  let students = [...fakeStudents];

  if (params?.classId) {
    students = students.filter((s) => s.classId === params.classId);
  }

  if (params?.sectionId) {
    students = students.filter((s) => s.sectionId === params.sectionId);
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    students = students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.rollNumber.toLowerCase().includes(searchLower),
    );
  }

  return {
    success: true,
    data: students,
  };
}
