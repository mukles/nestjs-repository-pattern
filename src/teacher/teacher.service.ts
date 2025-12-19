import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/repositories/interfaces/dataservice.interface';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(private readonly dataService: IDataService) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = this.dataService.teachers.create(createTeacherDto);
    return await this.dataService.teachers.save(teacher);
  }

  async findAll(): Promise<Teacher[]> {
    return await this.dataService.teachers.find({
      relations: ['courses'],
    });
  }

  async findOne(id: number): Promise<Teacher | null> {
    return await this.dataService.teachers.findOne({
      where: { id },
      relations: ['courses'],
    });
  }

  async findOneWithCourses(id: number): Promise<Teacher | null> {
    return await this.dataService.teachers.findOne({
      where: { id },
      relations: ['courses'],
    });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<void> {
    await this.dataService.teachers.update(id, updateTeacherDto);
  }

  async remove(id: number): Promise<void> {
    await this.dataService.teachers.delete(id);
  }
}
