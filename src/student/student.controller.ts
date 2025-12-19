import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { StudentService } from './student.service';

import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll(): Promise<StudentResponseDto[]> {
    const students = await this.studentService.findAllStudents();
    return students;
  }

  @Post('create')
  @ApiBody({ type: CreateStudentDto, description: 'Student data' })
  async create(@Body() student: CreateStudentDto) {
    return await this.studentService.createStudent(student);
  }

  @Get('create-multiple')
  async createMultiple() {}
}
