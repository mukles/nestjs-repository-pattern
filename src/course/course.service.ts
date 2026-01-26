import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'src/common/pagination/page-meta';
import { PaginationResultDto } from 'src/common/pagination/pagination-result.dto';

import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { CoursePaginationDto } from './dto/course-pagination.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';

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

  async createCourse(createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    const course = this.dataService.courses.create(createCourseDto);
    return await this.dataService.courses.save(course);
  }

  async getSingleCourse(id: string): Promise<CourseResponseDto | null> {
    return await this.dataService.courses.findOne({
      where: { id: Number(id) },
      relations: ['teacher', 'batch'],
    });
  }

  async updateCourse(id: string, updateCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    await this.dataService.courses.update({ id: Number(id) }, updateCourseDto);

    const existingCourse = await this.dataService.courses.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!existingCourse) {
      throw new Error(`Course with id '${id}' not found`);
    }

    const updatedCourse = Object.assign(existingCourse, updateCourseDto);

    return await this.dataService.courses.save(updatedCourse);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.dataService.courses.delete({ id: Number(id) });
  }
}
