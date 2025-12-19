import { Injectable } from '@nestjs/common';
import { IDataService } from '../repositories/interfaces/dataservice.interface';

import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly dataService: IDataService) {}

  async findAllStudents(): Promise<Student[]> {
    return await this.dataService.students.find();
  }

  async createStudent(student: CreateStudentDto): Promise<{ message: string; student: Student }> {
    const newStudent = this.dataService.students.create(student);
    await this.dataService.students.save(newStudent);
    return { message: 'Student created successfully', student: newStudent };
  }
}
