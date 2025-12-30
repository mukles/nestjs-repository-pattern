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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../common/pagination/pagination.service';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { CourseService } from './course.service';
import { CoursePaginationDto } from './dto/course-pagination.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Course')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CourseResponseDto)
  async findAll(
    @Query() filter: CoursePaginationDto,
  ): Promise<PaginationResultDto<CourseResponseDto>> {
    return this.courseService.findPaginatedCourses(filter);
  }
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateCourseDto, description: 'Course data' })
  async create(@Body() course: CreateCourseDto): Promise<CourseResponseDto> {
    return await this.courseService.createCourse(course);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<CourseResponseDto> {
    return await this.courseService.getSingleCourse(Number(id));
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateCourseDto, description: 'Course data' })
  async update(
    @Param('id') id: string,
    @Body() course: CreateCourseDto,
  ): Promise<CourseResponseDto> {
    return await this.courseService.updateCourse(Number(id), course);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.courseService.deleteCourse(Number(id));
  }
}
