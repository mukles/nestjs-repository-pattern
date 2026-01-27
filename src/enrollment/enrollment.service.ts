import { Injectable } from '@nestjs/common';

import { PageMetaDto } from '../common/pagination/page-meta';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { EnrollmentPaginationDto } from './dto/enrollment-pagination.dto';
import { EnrollResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentStatus } from './enum/enrolllment-status.enum';

@Injectable()
export class EnrollmentService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedEnrollments(
    filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    const qb = this.dataService.enrollments
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.batch', 'batch')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher');

    if (filter.status) {
      qb.andWhere('enrollment.status = :status', { status: filter.status });
    }

    if (filter.startDate) {
      qb.andWhere('enrollment.createdAt >= :startDate', {
        startDate: filter.startDate,
      });
    }

    if (filter.endDate) {
      qb.andWhere('enrollment.createdAt <= :endDate', {
        endDate: filter.endDate,
      });
    }

    const [enrollments, itemCount] = await qb
      .orderBy('enrollment.createdAt', filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const transformed = enrollments.map((e) => ({
      id: e.id,
      student: {
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
      },
      batch: {
        id: e.batch.id,
        name: e.batch.name,
      },
      course: {
        id: e.batch.course.id,
        title: e.batch.course.title,
        teacherName: `${e.batch.course.teacher.firstName} ${e.batch.course.teacher.lastName}`,
      },
      status: e.status,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));

    const pageMeta = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount,
    });

    return new PaginationResultDto(transformed, pageMeta);
  }

  async updateEnrollmentStatus(id: number, status: EnrollmentStatus): Promise<EnrollResponseDto> {
    const enrollment = await this.dataService.enrollments.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course', 'batch.course.teacher'],
    });

    if (!enrollment) {
      throw new Error(`Enrollment with id ${id} not found`);
    }

    enrollment.status = status;
    await this.dataService.enrollments.save(enrollment);

    return {
      id: enrollment.id,
      student: {
        id: enrollment.student.id,
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        email: enrollment.student.email,
      },
      batch: {
        id: enrollment.batch.id,
        name: enrollment.batch.name,
      },
      course: {
        id: enrollment.batch.course.id,
        title: enrollment.batch.course.title,
        teacherName: `${enrollment.batch.course.teacher.firstName} ${enrollment.batch.course.teacher.lastName}`,
      },
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    };
  }
}
