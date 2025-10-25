import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { EntityManager } from 'typeorm';
import { IDataService } from '../interfaces/dataservice.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { GenericRepository } from './repository.implementation';

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  students: IGenericRepository<Student>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Student)
    private readonly studentRepository: IGenericRepository<Student>,
  ) {}

  onApplicationBootstrap() {
    this.students = new GenericRepository<Student>(
      Student,
      this.entityManager,
      this.studentRepository.queryRunner!,
    );
  }
}
