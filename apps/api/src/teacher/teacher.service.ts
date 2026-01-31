import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { PageMetaDto } from "../common/pagination/page-meta";
import { PaginationResultDto } from "../common/pagination/pagination-result.dto";
import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { TeacherPaginationDto } from "./dto/teacher-pagination.dto";
import { TeacherResponseDto } from "./dto/teacher-response.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";

@Injectable()
export class TeacherService {
  constructor(private readonly dataService: IDataService) {}

  async findPaginatedTeachers(
    filter: TeacherPaginationDto,
  ): Promise<PaginationResultDto<TeacherResponseDto>> {
    const qb = this.dataService.teachers.createQueryBuilder("teacher");

    if (filter.name) {
      qb.andWhere(
        "(teacher.firstName ILIKE :name OR teacher.lastName ILIKE :name OR CONCAT(teacher.firstName, ' ', teacher.lastName) ILIKE :name)",
        { name: `%${filter.name}%` },
      );
    }

    if (filter.email) {
      qb.andWhere("teacher.email ILIKE :email", { email: `%${filter.email}%` });
    }

    const [teachers, itemCount] = await qb
      .orderBy("teacher.createdAt", filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const pageMeta = new PageMetaDto({ pageOptionsDto: filter, itemCount });
    const teacherDtos = plainToInstance(TeacherResponseDto, teachers, {
      excludeExtraneousValues: false,
    });

    return new PaginationResultDto<TeacherResponseDto>(teacherDtos, pageMeta);
  }

  async create(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    const teacher = this.dataService.teachers.create(createTeacherDto);
    const savedTeacher = await this.dataService.teachers.save(teacher);
    return plainToInstance(TeacherResponseDto, savedTeacher, {
      excludeExtraneousValues: false,
    });
  }

  async findOne(id: number): Promise<TeacherResponseDto | null> {
    const teacher = await this.dataService.teachers.findOne({
      where: { id },
      relations: ["courses"],
    });
    if (!teacher) return null;
    return plainToInstance(TeacherResponseDto, teacher, {
      excludeExtraneousValues: false,
    });
  }

  async findOneWithCourses(id: number): Promise<TeacherResponseDto | null> {
    const teacher = await this.dataService.teachers.findOne({
      where: { id },
      relations: ["courses"],
    });
    if (!teacher) return null;
    return plainToInstance(TeacherResponseDto, teacher, {
      excludeExtraneousValues: false,
    });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<void> {
    await this.dataService.teachers.update(id, updateTeacherDto);
  }

  async remove(id: number): Promise<void> {
    await this.dataService.teachers.delete(id);
  }
}
