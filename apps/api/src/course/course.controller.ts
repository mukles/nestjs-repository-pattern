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
import { PaginationResultDto } from "../common/pagination/pagination-result.dto";
import { ApiResponse } from "../common/response/api-response.decorator";
import { Permission } from "../role/enums/permission.enum";
import { CourseService } from "./course.service";
import { CoursePaginationDto } from "./dto/course-pagination.dto";
import { CourseResponseDto } from "./dto/course-response.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiBearerAuth("JWT-auth")
@ApiTags("Course")
@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get("/")
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.READ_COURSE)
  findAll(
    @Query() filter: CoursePaginationDto,
  ): Promise<PaginationResultDto<CourseResponseDto>> {
    return this.courseService.findPaginatedCourses(filter);
  }

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateCourseDto, description: "Course data" })
  @ApiResponse(CourseResponseDto)
  @Permissions(Permission.CREATE_COURSE)
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseResponseDto> {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.READ_COURSE)
  @ApiResponse(CourseResponseDto)
  async findOne(@Param("id") id: string) {
    return await this.courseService.getSingleCourse(id);
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateCourseDto, description: "Course data" })
  @Permissions(Permission.UPDATE_COURSE)
  async update(@Param("id") id: string, @Body() course: UpdateCourseDto) {
    console.log({ id, course });
    return await this.courseService.updateCourse(id, course);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.DELETE_COURSE)
  async delete(@Param("id") id: string) {
    return await this.courseService.deleteCourse(id);
  }
}
