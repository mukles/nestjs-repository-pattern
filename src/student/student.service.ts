import { ConflictException, Injectable } from '@nestjs/common';

import { PaginationService } from '../common/pagination/pagination.service';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentPaginationDto } from './dto/student-pagination.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly dataService: IDataService) {}

  async findAllStudents(): Promise<Student[]> {
    return await this.dataService.students.find();
  }

  async findPaginatedStudents(filter: StudentPaginationDto): Promise<PaginationResultDto<Student>> {
    const qb = this.dataService.students.createQueryBuilder('student');

    if (filter.name) {
      qb.andWhere(
        "(student.firstName ILIKE :name OR student.lastName ILIKE :name OR CONCAT(student.firstName, ' ', student.lastName) ILIKE :name)",
        { name: `%${filter.name}%` },
      );
    }

    if (filter.email) {
      qb.andWhere('student.email ILIKE :email', { email: `%${filter.email}%` });
    }

    return PaginationService.paginate(qb, filter);
  }

  async createStudent(student: CreateStudentDto): Promise<{ message: string; student: Student }> {
    const existingStudent = await this.dataService.students.findOne({
      where: { email: student.email },
    });

    if (existingStudent) {
      throw new ConflictException(`Student with email '${student.email}' already exists`);
    }

    const newStudent = this.dataService.students.create(student);
    await this.dataService.students.save(newStudent);
    return { message: 'Student created successfully', student: newStudent };
  }
}
