export interface Student {
  id: number;
  userId: number;
  rollNumber: string;
  dateOfBirth: Date;
  address: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  dateOfBirth: string;
  address: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  status?: string;
}
