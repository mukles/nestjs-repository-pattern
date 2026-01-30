import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PageMetaDto } from "../common/pagination/page-meta";
import { PaginationResultDto } from "../common/pagination/pagination-result.dto";
import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { CreateResultDto } from "./dto/create-result.dto";
import { ResultPaginationDto } from "./dto/result-pagination.dto";
import { ResultResponseDto } from "./dto/result-response.dto";
import { UpdateResultDto } from "./dto/update-result.dto";

@Injectable()
export class ResultService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedResults(
    filter: ResultPaginationDto,
  ): Promise<PaginationResultDto<ResultResponseDto>> {
    const qb = this.dataService.results.createQueryBuilder("result");

    if (filter.courseId) {
      qb.innerJoinAndSelect("result.enrollment", "enrollment")
        .innerJoinAndSelect("enrollment.batch", "batch")
        .innerJoinAndSelect("batch.course", "course")
        .andWhere("course.id = :courseId", { courseId: filter.courseId });
    }

    if (filter.batchId) {
      qb.innerJoinAndSelect("result.enrollment", "enrollment")
        .innerJoinAndSelect("enrollment.batch", "batch")
        .andWhere("batch.id = :batchId", { batchId: filter.batchId });
    }

    if (filter.studentId) {
      qb.innerJoinAndSelect("result.enrollment", "enrollment")
        .innerJoinAndSelect("enrollment.student", "student")
        .andWhere("student.id = :studentId", { studentId: filter.studentId });
    }

    if (filter.enrollmentId) {
      qb.innerJoinAndSelect("result.enrollment", "enrollment").andWhere(
        "enrollment.id = :enrollmentId",
        { enrollmentId: filter.enrollmentId },
      );
    }

    const [results, itemCount] = await qb
      .orderBy("result.createdAt", filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const resultDtos: ResultResponseDto[] = results.map((saved) => {
      const percentage = (saved.score / saved.maxScore) * 100;
      return {
        id: saved.id,
        type: saved.type,
        score: saved.score,
        maxScore: saved.maxScore,
        percentage,
        grade: saved.grade,
        remarks: saved.remarks,
        student: {
          id: saved.enrollment.student.id,
          name: `${saved.enrollment.student.firstName} ${saved.enrollment.student.lastName}`,
        },
        batch: {
          id: saved.enrollment.batch.id,
          name: saved.enrollment.batch.name,
        },
        course: {
          id: saved.enrollment.batch.course.id,
          title: saved.enrollment.batch.course.title,
        },
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      };
    });

    const pageMeta = new PageMetaDto({ pageOptionsDto: filter, itemCount });

    return new PaginationResultDto<ResultResponseDto>(resultDtos, pageMeta);
  }

  async create(createResultDto: CreateResultDto): Promise<ResultResponseDto> {
    const { enrollmentId, score, maxScore, type, grade, remarks } =
      createResultDto;

    if (score > maxScore) {
      throw new BadRequestException("Score cannot be greater than maxScore");
    }

    const enrollment = await this.dataService.enrollments.findOne({
      where: { id: enrollmentId },
      relations: ["student", "batch", "batch.course"],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }

    const result = this.dataService.results.create({
      enrollment,
      type,
      score,
      maxScore,
      grade,
      remarks,
    });

    const saved = await this.dataService.results.save(result);

    const percentage = (saved.score / saved.maxScore) * 100;

    return {
      id: saved.id,
      type: saved.type,
      score: saved.score,
      maxScore: saved.maxScore,
      percentage,
      grade: saved.grade,
      remarks: saved.remarks,
      student: {
        id: enrollment.student.id,
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      },
      batch: {
        id: enrollment.batch.id,
        name: enrollment.batch.name,
      },
      course: {
        id: enrollment.batch.course.id,
        title: enrollment.batch.course.title,
      },
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async findOne(id: number): Promise<ResultResponseDto> {
    const saved = await this.dataService.results.findOne({
      where: { id },
      relations: [
        "enrollment",
        "enrollment.student",
        "enrollment.batch",
        "enrollment.batch.course",
      ],
    });
    if (!saved) {
      throw new NotFoundException(`Result ${id} not found`);
    }
    const percentage = (saved.score / saved.maxScore) * 100;
    return {
      id: saved.id,
      type: saved.type,
      score: saved.score,
      maxScore: saved.maxScore,
      percentage,
      grade: saved.grade,
      remarks: saved.remarks,
      student: {
        id: saved.enrollment.student.id,
        name: `${saved.enrollment.student.firstName} ${saved.enrollment.student.lastName}`,
      },
      batch: {
        id: saved.enrollment.batch.id,
        name: saved.enrollment.batch.name,
      },
      course: {
        id: saved.enrollment.batch.course.id,
        title: saved.enrollment.batch.course.title,
      },
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async update(
    id: number,
    updateResultDto: UpdateResultDto,
  ): Promise<ResultResponseDto> {
    const saved = await this.dataService.results.findOne({
      where: { id },
      relations: [
        "enrollment",
        "enrollment.student",
        "enrollment.batch",
        "enrollment.batch.course",
      ],
    });
    if (!saved) {
      throw new NotFoundException(`Result ${id} not found`);
    }
    // Only update allowed fields
    Object.assign(saved, updateResultDto);
    if (saved.score > saved.maxScore) {
      throw new BadRequestException("Score cannot be greater than maxScore");
    }
    const updated = await this.dataService.results.save(saved);
    const percentage = (updated.score / updated.maxScore) * 100;
    return {
      id: updated.id,
      type: updated.type,
      score: updated.score,
      maxScore: updated.maxScore,
      percentage,
      grade: updated.grade,
      remarks: updated.remarks,
      student: {
        id: updated.enrollment.student.id,
        name: `${updated.enrollment.student.firstName} ${updated.enrollment.student.lastName}`,
      },
      batch: {
        id: updated.enrollment.batch.id,
        name: updated.enrollment.batch.name,
      },
      course: {
        id: updated.enrollment.batch.course.id,
        title: updated.enrollment.batch.course.title,
      },
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const saved = await this.dataService.results.findOne({ where: { id } });
    if (!saved) {
      throw new NotFoundException(`Result ${id} not found`);
    }
    await this.dataService.results.remove(saved);
    return { message: `Result ${id} removed successfully` };
  }
}
