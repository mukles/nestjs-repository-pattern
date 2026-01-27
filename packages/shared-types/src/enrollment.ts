export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  batchId: number;
  status: string;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnrollmentDto {
  studentId: number;
  courseId: number;
  batchId: number;
}

export interface UpdateEnrollmentDto {
  status?: string;
}
