import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { Permission } from '../role/enums/permission.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentPaginationDto } from './dto/student-pagination.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentService } from './student.service';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Permissions(Permission.READ_STUDENT)
  async findAll(
    @Query() filter: StudentPaginationDto,
  ): Promise<PaginationResultDto<StudentResponseDto>> {
    return this.studentService.findPaginatedStudents(filter);
  }

  @Post('create')
  @ApiBody({ type: CreateStudentDto, description: 'Student data' })
  @Permissions(Permission.CREATE_STUDENT)
  async create(@Body() student: CreateStudentDto) {
    return await this.studentService.createStudent(student);
  }

  @Get('/:id')
  @Permissions(Permission.READ_STUDENT)
  async findOne(@Param('id') id: string) {
    return await this.studentService.getSingleStudent(id);
  }

  @Put('/:id')
  @ApiBody({ type: CreateStudentDto, description: 'Student data' })
  @Permissions(Permission.UPDATE_STUDENT)
  async update(@Param('id') id: string, @Body() student: CreateStudentDto) {
    return await this.studentService.updateStudent(id, student);
  }

  @Delete('/:id')
  @Permissions(Permission.DELETE_STUDENT)
  async delete(@Param('id') id: string) {
    return await this.studentService.deleteStudent(id);
  }
}
