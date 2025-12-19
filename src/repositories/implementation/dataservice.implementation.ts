import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { EntityManager } from 'typeorm';

import { IDataService } from '../interfaces/dataservice.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { GenericRepository } from './repository.implementation';

@Injectable()
export class GenericDataService implements IDataService, OnApplicationBootstrap {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Student)
    private readonly studentRepository: IGenericRepository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: IGenericRepository<Teacher>,
  ) {
    void Promise.resolve();
  }

  onApplicationBootstrap() {
    this.teachers = new GenericRepository<Teacher>(
      Teacher,
      this.entityManager,
      this.teacherRepository.queryRunner!,
    );

    this.students = new GenericRepository<Student>(
      Student,
      this.entityManager,
      this.studentRepository.queryRunner!,
    );
  }
}
