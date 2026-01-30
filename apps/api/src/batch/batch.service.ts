import { Injectable, NotFoundException } from "@nestjs/common";

import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { BatchResponseDto } from "./dto/batch-response.dto";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";
import { BatchEntity } from "./entities/batch.entity";

@Injectable()
export class BatchService {
  constructor(private readonly dataService: IDataService) {}

  async create(
    courseId: number,
    createBatchDto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
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

  async findAll(courseId: number): Promise<BatchResponseDto[]> {
    const batches = await this.dataService.batches.find({
      where: { course: { id: courseId } },
      relations: ["course", "enrollments"],
      order: { startDate: "DESC" },
    });

    return batches.map((batch) =>
      this.transformBatchToResponse(batch, batch.enrollments?.length || 0),
    );
  }

  async findOne(courseId: number, id: number): Promise<BatchResponseDto> {
    const batch = await this.dataService.batches.findOne({
      where: { id, course: { id: courseId } },
      relations: ["course", "enrollments"],
    });

    if (!batch) {
      throw new NotFoundException(
        `Batch with id '${id}' not found for course '${courseId}'`,
      );
    }

    return this.transformBatchToResponse(batch, batch.enrollments?.length || 0);
  }

  async update(
    id: number,
    updateBatchDto: UpdateBatchDto,
  ): Promise<BatchResponseDto> {
    const batch = await this.dataService.batches.findOne({
      where: { id },
      relations: ["course", "enrollments"],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id '${id}' not found`);
    }

    Object.assign(batch, updateBatchDto);
    const updatedBatch = await this.dataService.batches.save(batch);

    return this.transformBatchToResponse(
      updatedBatch,
      batch.enrollments?.length || 0,
    );
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

  private transformBatchToResponse(
    batch: BatchEntity,
    enrolledCount: number,
  ): BatchResponseDto {
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
