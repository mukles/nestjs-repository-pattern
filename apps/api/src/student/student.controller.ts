import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

import { Permissions } from "../auth/decorators/permissions.decorator";
import { ApiPaginatedResponse } from "../common/pagination/pagination.service";
import { PaginationResultDto } from "../common/pagination/pagination-result.dto";
import { ApiResponse } from "../common/response";
import { Permission } from "../role/enums/permission.enum";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentPaginationDto } from "./dto/student-pagination.dto";
import { StudentResponseDto } from "./dto/student-response.dto";
import { StudentService } from "./student.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("Student")
@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(StudentResponseDto)
  async findAll(
    @Query() filter: StudentPaginationDto,
  ): Promise<PaginationResultDto<StudentResponseDto>> {
    return this.studentService.findPaginatedStudents(filter);
  }

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateStudentDto, description: "Student data" })
  @ApiResponse(StudentResponseDto)
  @Permissions(Permission.CREATE_STUDENT)
  async create(@Body() student: CreateStudentDto): Promise<StudentResponseDto> {
    return await this.studentService.createStudent(student);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.READ_STUDENT)
  @ApiResponse(StudentResponseDto)
  async findOne(@Param("id") id: string) {
    return await this.studentService.getSingleStudent(id);
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateStudentDto, description: "Student data" })
  @Permissions(Permission.UPDATE_STUDENT)
  async update(@Param("id") id: string, @Body() student: CreateStudentDto) {
    return await this.studentService.updateStudent(id, student);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.DELETE_STUDENT)
  async delete(@Param("id") id: string) {
    return await this.studentService.deleteStudent(id);
  }
}
