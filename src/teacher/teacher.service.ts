import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/repositories/interfaces/dataservice.interface';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly dataService: IDataService) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.dataService.teachers.create(createTeacherDto);
  }

  findAll() {
    return this.dataService.teachers.find();
  }

  findOne(id: number) {
    return this.dataService.teachers.findBy({
      id: id,
    });
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.dataService.teachers.update(id, updateTeacherDto);
  }

  remove(id: number) {
    return this.dataService.teachers.delete(id);
  }
}
