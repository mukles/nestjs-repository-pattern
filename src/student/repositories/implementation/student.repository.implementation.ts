import { CreateStudentDto } from 'src/student/dto/create-student.dto';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentRepository } from '../student.repository.interface';

export class StudentTypeOrmRepository implements StudentRepository {
  constructor(private readonly studentRepository: Repository<Student>) {}

  findAll(): void {
    throw new Error('Method not implemented.');
  }
  findById(userId: string): void {
    throw new Error('Method not implemented.');
  }
  create(userDto: CreateStudentDto): void {
    throw new Error('Method not implemented.');
  }
}
