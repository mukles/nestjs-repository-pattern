import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { EntityManager } from 'typeorm';

import { IDataService } from '../interfaces/dataservice.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { GenericRepository } from './repository.implementation';

@Injectable()
export class GenericDataService implements IDataService, OnApplicationBootstrap {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;
  courses: IGenericRepository<Course>;
  enrollments: IGenericRepository<Enrollment>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Student)
    private readonly studentRepository: IGenericRepository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: IGenericRepository<Teacher>,
    @InjectRepository(Course)
    private readonly courseRepository: IGenericRepository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: IGenericRepository<Enrollment>,
  ) {}

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

    this.courses = new GenericRepository<Course>(
      Course,
      this.entityManager,
      this.courseRepository.queryRunner!,
    );
    this.enrollments = new GenericRepository<Enrollment>(
      Enrollment,
      this.entityManager,
      this.enrollmentRepository.queryRunner!,
    );
  }
}
