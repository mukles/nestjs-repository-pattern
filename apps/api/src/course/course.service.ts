import { Injectable, NotFoundException } from '@nestjs/common';

import { PageMetaDto } from '../common/pagination/page-meta';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { TeacherEntity } from '../teacher/entities/teacher.entity';
import { CoursePaginationDto } from './dto/course-pagination.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedCourses(
    filter: CoursePaginationDto,
  ): Promise<PaginationResultDto<CourseResponseDto>> {
    const qb = this.dataService.courses.createQueryBuilder('course');

    if (filter.title) {
      qb.andWhere('course.title ILIKE :title', { title: `%${filter.title}%` });
    }

    if (filter.code) {
      qb.andWhere('course.code ILIKE :code', { code: `%${filter.code}%` });
    }

    const [courses, itemCount] = await qb
      .orderBy('course.createdAt', filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const pageMeta = new PageMetaDto({ pageOptionsDto: filter, itemCount });

    return new PaginationResultDto<CourseResponseDto>(courses, pageMeta);
  }

  async createCourse(
    createCourseDto: CreateCourseDto,
  ): Promise<CourseResponseDto> {
    const { teacherId, ...courseData } = createCourseDto;

    const course = this.dataService.courses.create({
      ...courseData,
      teacher: { id: teacherId } as TeacherEntity,
    });

    return await this.dataService.courses.save(course);
  }

  async getSingleCourse(id: string): Promise<CourseResponseDto | null> {
    const course = await this.dataService.courses.findOne({
      where: { id: Number(id) },
    });

    if (!course) {
      throw new NotFoundException(`Course with id '${id}' not found`);
    }

    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    const existingCourse = await this.dataService.courses.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with id '${id}' not found`);
    }

    const { teacherId, ...courseData } = updateCourseDto;

    Object.assign(existingCourse, {
      ...courseData,
      teacher: { id: teacherId } as TeacherEntity,
    });

    return await this.dataService.courses.save(existingCourse);
  }

  async deleteCourse(id: string): Promise<void> {
    const existingCourse = await this.dataService.courses.findOne({
      where: { id: Number(id) },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with id '${id}' not found`);
    }

    await this.dataService.courses.delete({ id: Number(id) });
  }
}
