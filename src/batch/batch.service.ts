import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus } from 'src/enrollment/enum/enrolllment-status.enum';

import { CreateEnrollmentDto } from '../enrollment/dto/create-enrollment.dto';
import { EnrollResponseDto } from '../enrollment/dto/enrollment-response.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { BatchResponseDto } from './dto/batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';
import { BatchStatus } from './enum/batch-status.enum';

@Injectable()
export class BatchService {
  constructor(private readonly dataService: IDataService) {}

  async create(courseId: number, createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const course = await this.dataService.courses.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with id '${courseId}' not found`);
    }

    const batch = this.dataService.batches.create({
      ...createBatchDto,
      course,
    });

    const savedBatch = await this.dataService.batches.save(batch);

    return this.transformBatchToResponse(savedBatch, 0);
  }

  async enrollment(
    courseId: number,
    batchId: number,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollResponseDto> {
    const batch = await this.dataService.batches.findOne({
      where: { id: batchId, course: { id: courseId } },
      relations: ['course', 'course.teacher', 'enrollments'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id '${batchId}' not found for course '${courseId}'`);
    }

    if (batch.status !== BatchStatus.OPEN) {
      throw new BadRequestException(
        `Batch is currently '${batch.status}'. Only batches with 'open' status accept enrollments`,
      );
    }

    const student = await this.dataService.students.findOne({
      where: { id: createEnrollmentDto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with id '${createEnrollmentDto.studentId}' not found`);
    }

    const existingEnrollment = await this.dataService.enrollments.findOne({
      where: {
        student: { id: student.id },
        batch: { id: batchId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException(
        `Student with id '${student.id}' is already enrolled in this batch`,
      );
    }

    const enrolledCount = await this.dataService.enrollments.count({
      where: { batch: { id: batchId } },
    });

    if (enrolledCount >= batch.maxStudents) {
      throw new BadRequestException(
        `Batch is full. Maximum capacity is ${batch.maxStudents} students`,
      );
    }

    const enrollment = this.dataService.enrollments.create({
      student,
      batch,
      status: createEnrollmentDto.status || EnrollmentStatus.ACTIVE,
    });

    const savedEnrollment = await this.dataService.enrollments.save(enrollment);

    return {
      id: savedEnrollment.id,
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
      },
      batch: {
        id: batch.id,
        name: batch.name,
      },
      course: {
        id: batch.course.id,
        title: batch.course.title,
        teacherName: `${batch.course.teacher.firstName} ${batch.course.teacher.lastName}`,
      },
      status: savedEnrollment.status,
      createdAt: savedEnrollment.createdAt,
      updatedAt: savedEnrollment.updatedAt,
    };
  }

  async findAll(courseId: number): Promise<BatchResponseDto[]> {
    const batches = await this.dataService.batches.find({
      where: { course: { id: courseId } },
      relations: ['course', 'enrollments'],
      order: { startDate: 'DESC' },
    });

    return batches.map((batch) =>
      this.transformBatchToResponse(batch, batch.enrollments?.length || 0),
    );
  }

  async findOne(courseId: number, id: number): Promise<BatchResponseDto> {
    const batch = await this.dataService.batches.findOne({
      where: { id, course: { id: courseId } },
      relations: ['course', 'enrollments'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id '${id}' not found for course '${courseId}'`);
    }

    return this.transformBatchToResponse(batch, batch.enrollments?.length || 0);
  }

  async update(id: number, updateBatchDto: UpdateBatchDto): Promise<BatchResponseDto> {
    const batch = await this.dataService.batches.findOne({
      where: { id },
      relations: ['course', 'enrollments'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id '${id}' not found`);
    }

    Object.assign(batch, updateBatchDto);
    const updatedBatch = await this.dataService.batches.save(batch);

    return this.transformBatchToResponse(updatedBatch, batch.enrollments?.length || 0);
  }

  async remove(id: number): Promise<void> {
    const batch = await this.dataService.batches.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id '${id}' not found`);
    }

    await this.dataService.batches.remove(batch);
  }

  private transformBatchToResponse(batch: Batch, enrolledCount: number): BatchResponseDto {
    return {
      id: batch.id,
      name: batch.name,
      startDate: batch.startDate,
      endDate: batch.endDate,
      maxStudents: batch.maxStudents,
      enrolledStudents: enrolledCount,
      status: batch.status,
      courseId: batch.course.id,
      courseTitle: batch.course.title,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }
}
