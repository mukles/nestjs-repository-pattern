import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtPayload } from '../auth/interface/jwt-interface';
import { PageMetaDto } from '../common/pagination/page-meta';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { Role } from '../role/enums/role.enum';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentPaginationDto } from './dto/enrollment-pagination.dto';
import { EnrollResponseDto } from './dto/enrollment-response.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { EnrollmentStatus } from './enum/enrolllment-status.enum';

@Injectable()
export class EnrollmentService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedEnrollments(
    filter: EnrollmentPaginationDto,
    user?: JwtPayload,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    const qb = this.dataService.enrollments
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.batch', 'batch')
      .leftJoinAndSelect('batch.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher');

    if (user && user.role?.includes(Role.TEACHER)) {
      const teacher = await this.dataService.teachers.findOne({
        where: { email: user.email },
      });

      if (!teacher) {
        throw new NotFoundException(
          'Teacher profile not found for current user',
        );
      }

      qb.andWhere('teacher.id = :teacherId', { teacherId: teacher.id });
    }

    if (filter.status) {
      qb.andWhere('enrollment.status = :status', { status: filter.status });
    }

    if (filter.courseId) {
      qb.andWhere('course.id = :courseId', { courseId: filter.courseId });
    }

    if (filter.batchId) {
      qb.andWhere('batch.id = :batchId', { batchId: filter.batchId });
    }

    if (filter.studentId) {
      qb.andWhere('student.id = :studentId', { studentId: filter.studentId });
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

    const transformed = enrollments.map((e) => this.transformToResponseDto(e));

    const pageMeta = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount,
    });

    return new PaginationResultDto(transformed, pageMeta);
  }

  async create(
    courseId: number,
    batchId: number,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollResponseDto> {
    const student = await this.dataService.students.findOne({
      where: { id: createEnrollmentDto.studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with id ${createEnrollmentDto.studentId} not found`,
      );
    }

    const batch = await this.dataService.batches.findOne({
      where: { id: batchId },
      relations: ['course', 'course.teacher'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`);
    }

    // Validate that the batch belongs to the specified course
    if (batch.course.id !== courseId) {
      throw new BadRequestException(
        `Batch with id ${batchId} does not belong to course with id ${courseId}`,
      );
    }

    const existingEnrollment = await this.dataService.enrollments.findOne({
      where: {
        student: { id: createEnrollmentDto.studentId },
        batch: { id: batchId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this batch');
    }

    const enrollment = this.dataService.enrollments.create({
      student,
      batch,
      status: createEnrollmentDto.status || EnrollmentStatus.ACTIVE,
    });

    const savedEnrollment = await this.dataService.enrollments.save(enrollment);

    const enrollmentWithRelations = await this.dataService.enrollments.findOne({
      where: { id: savedEnrollment.id },
      relations: ['student', 'batch', 'batch.course', 'batch.course.teacher'],
    });

    if (!enrollmentWithRelations) {
      throw new NotFoundException('Failed to retrieve created enrollment');
    }

    return this.transformToResponseDto(enrollmentWithRelations);
  }

  async findOne(id: number): Promise<EnrollResponseDto> {
    const enrollment = await this.dataService.enrollments.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course', 'batch.course.teacher'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }

    return this.transformToResponseDto(enrollment);
  }

  async updateEnrollmentStatus(
    id: number,
    updateStatusDto: UpdateEnrollmentStatusDto,
  ): Promise<EnrollResponseDto> {
    const enrollment = await this.dataService.enrollments.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course', 'batch.course.teacher'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }

    if (updateStatusDto.status === EnrollmentStatus.SUSPENDED) {
      if (!updateStatusDto.suspensionReason) {
        throw new BadRequestException(
          'Suspension reason is required when suspending an enrollment',
        );
      }
      enrollment.suspensionReason = updateStatusDto.suspensionReason;
      enrollment.suspendedAt = new Date();
    } else if (enrollment.status === EnrollmentStatus.SUSPENDED) {
      // Clear suspension data when changing from suspended to another status
      enrollment.suspensionReason = null;
      enrollment.suspendedAt = null;
    }

    enrollment.status = updateStatusDto.status;
    const updatedEnrollment =
      await this.dataService.enrollments.save(enrollment);

    return this.transformToResponseDto(updatedEnrollment);
  }

  private transformToResponseDto(
    enrollment: EnrollmentEntity,
  ): EnrollResponseDto {
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
      suspensionReason: enrollment.suspensionReason,
      suspendedAt: enrollment.suspendedAt,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    };
  }
}
