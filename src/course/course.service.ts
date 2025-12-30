import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'src/common/pagination/page-meta';
import { PaginationResultDto } from 'src/common/pagination/pagination-result.dto';

import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { CoursePaginationDto } from './dto/course-pagination.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedCourses(filter: CoursePaginationDto): Promise<PaginationResultDto<Course>> {
    const qb = this.dataService.courses.createQueryBuilder('course');

    if (filter.title) {
      qb.andWhere('course.title ILIKE :title', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.code) {
      qb.andWhere('course.code ILIKE :code', {
        code: `%${filter.code}%`,
      });
    }

    if (filter.tags && filter.tags.length > 0) {
      qb.andWhere('course.tags && ARRAY[:...tags]', { tags: filter.tags });
    }

    if (filter.teacherId && filter.teacherId.length > 0) {
      qb.andWhere('course.teacherId IN (:...teacherIds)', { teacherIds: filter.teacherId });
    }

    const [courses, itemCount] = await qb
      .orderBy('course.createdAt', filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const meta = new PageMetaDto({ pageOptionsDto: filter, itemCount });
    return new PaginationResultDto(courses, meta);
  }

  async getSingleCourse(id: number): Promise<CourseResponseDto> {
    const course = await this.dataService.courses.findOne({ where: { id } });
    if (!course) {
      throw new Error(`Course with id '${id}' not found`);
    }
    return course;
  }

  async createCourse(course: CreateCourseDto): Promise<CourseResponseDto> {
    const existingCourse = await this.dataService.courses.findOne({
      where: { code: course.code },
    });

    if (existingCourse) {
      throw new Error(`Course with code '${course.code}' already exists`);
    }

    const newCourse = this.dataService.courses.create(course);
    await this.dataService.courses.save(newCourse);
    return newCourse;
  }

  async updateCourse(id: number, course: CreateCourseDto): Promise<CourseResponseDto> {
    const existingCourse = await this.dataService.courses.findOne({
      where: { id },
    });

    if (!existingCourse) {
      throw new Error(`Course with id '${id}' not found`);
    }

    const updatedCourse = Object.assign(existingCourse, course);

    await this.dataService.courses.save(updatedCourse);

    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<{ message: string }> {
    const existingCourse = await this.dataService.courses.findOne({
      where: { id },
    });

    if (!existingCourse) {
      throw new Error(`Course with id '${id}' not found`);
    }

    await this.dataService.courses.remove(existingCourse);
    return { message: 'Course deleted successfully' };
  }
}
