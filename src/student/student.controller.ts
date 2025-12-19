import { Controller, Get } from '@nestjs/common';

import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return await this.studentService.findAllStudents();
  }

  @Get('create')
  async create() {
    return await this.studentService.createStudent();
  }

  @Get('create-multiple')
  async createMultiple() {
    return await this.studentService.createMultipleStudents();
  }
}
