import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '../common/pagination/pagination.service';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { ApiResponse } from '../common/response';
import { Permission } from '../role/enums/permission.enum';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherPaginationDto } from './dto/teacher-pagination.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Teacher')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(TeacherResponseDto)
  @Permissions(Permission.READ_TEACHER)
  findAll(@Query() filter: TeacherPaginationDto): Promise<PaginationResultDto<TeacherResponseDto>> {
    return this.teacherService.findPaginatedTeachers(filter);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(TeacherResponseDto)
  @Permissions(Permission.CREATE_TEACHER)
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<TeacherResponseDto> {
    return this.teacherService.create(createTeacherDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(TeacherResponseDto)
  @Permissions(Permission.READ_TEACHER)
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @Get(':id/courses')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(TeacherResponseDto)
  @Permissions(Permission.READ_TEACHER)
  findOneWithCourses(@Param('id') id: string) {
    return this.teacherService.findOneWithCourses(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(TeacherResponseDto)
  @Permissions(Permission.UPDATE_TEACHER)
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(TeacherResponseDto)
  @Permissions(Permission.DELETE_TEACHER)
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
