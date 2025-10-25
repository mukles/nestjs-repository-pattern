import { CreateStudentDto } from '../dto/create-student.dto';

export interface StudentRepository {
  findAll(): void;
  findById(userId: string): void;
  create(userDto: CreateStudentDto): void;
}

export const STUDENT_REPOSITORY_TOKEN = 'student-repository-token';
