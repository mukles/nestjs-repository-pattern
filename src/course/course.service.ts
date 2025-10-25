import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/repositories/interfaces/dataservice.interface';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(private dataService: IDataService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.dataService.courses.create(createCourseDto);
    return await this.dataService.courses.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.dataService.courses.find({
      relations: ['teacher'],
    });
  }

  async findOne(id: number): Promise<Course | null> {
    return await this.dataService.courses.findOne({
      where: { id },
      relations: ['teacher'],
    });
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course | null> {
    await this.dataService.courses.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.dataService.courses.delete(id);
  }

  async findByTeacher(teacherId: number): Promise<Course[]> {
    return await this.dataService.courses.find({
      where: { teacherId },
      relations: ['teacher'],
    });
  }
}
