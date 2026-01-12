import { Injectable } from '@nestjs/common';

import { PageMetaDto } from '../common/pagination/page-meta';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentPaginationDto } from './dto/enrollment-pagination.dto';
import { EnrollResponseDto } from './dto/enrollment-response.dto';

@Injectable()
export class EnrollmentService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedEnrollments(
    filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    const qb = this.dataService.enrollments
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher');

    if (filter.status) {
      qb.andWhere('enrollment.status = :status', { status: filter.status });
    }

    if (filter.startDate) {
      qb.andWhere('enrollment.createdAt >= :startDate', { startDate: filter.startDate });
    }

    if (filter.endDate) {
      qb.andWhere('enrollment.createdAt <= :endDate', { endDate: filter.endDate });
    }

    const [enrollments, itemCount] = await qb
      .orderBy('enrollment.createdAt', filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const transformedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      student: {
        id: enrollment.student.id,
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        email: enrollment.student.email,
      },
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        teacherName: `${enrollment.course.teacher.firstName} ${enrollment.course.teacher.lastName}`,
      },
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    }));

    const pageMeta = new PageMetaDto({ pageOptionsDto: filter, itemCount });
    return new PaginationResultDto<EnrollResponseDto>(transformedEnrollments, pageMeta);
  }

  async updateEnrollmentStatus(
    id: string,
    enrollment: CreateEnrollmentDto,
  ): Promise<EnrollResponseDto> {
    const existingEnrollment = await this.dataService.enrollments.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['student', 'course', 'course.teacher'],
    });

    if (!existingEnrollment) {
      throw new Error(`Enrollment with id '${id}' not found`);
    }

    const updatedEnrollment = Object.assign(existingEnrollment, enrollment);

    await this.dataService.enrollments.save(updatedEnrollment);

    return {
      id: updatedEnrollment.id,
      student: {
        id: updatedEnrollment.student.id,
        name: `${updatedEnrollment.student.firstName} ${updatedEnrollment.student.lastName}`,
        email: updatedEnrollment.student.email,
      },
      course: {
        id: updatedEnrollment.course.id,
        title: updatedEnrollment.course.title,
        teacherName: `${updatedEnrollment.course.teacher.firstName} ${updatedEnrollment.course.teacher.lastName}`,
      },
      status: updatedEnrollment.status,
      createdAt: updatedEnrollment.createdAt,
      updatedAt: updatedEnrollment.updatedAt,
    };
  }
}
