import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentPaginationDto } from './dto/student-pagination.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentService } from './student.service';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll(
    @Query() filter: StudentPaginationDto,
  ): Promise<PaginationResultDto<StudentResponseDto>> {
    return this.studentService.findPaginatedStudents(filter);
  }

  @Post('create')
  @ApiBody({ type: CreateStudentDto, description: 'Student data' })
  async create(@Body() student: CreateStudentDto) {
    return await this.studentService.createStudent(student);
  }

  @Get('create-multiple')
  async createMultiple() {}
}
