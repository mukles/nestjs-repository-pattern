import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Batch } from '../../batch/entities/batch.entity';
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { PermissionEntity } from '../../role/entities/permission.entity';
import { Role } from '../../role/entities/role.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { User } from '../../user/entities/user.entity';
import { IDataService } from '../interfaces/dataservice.interface';
import { IGenericRepository } from '../interfaces/repository.interface';
import { GenericRepository } from './repository.implementation';

@Injectable()
export class GenericDataService implements IDataService, OnApplicationBootstrap {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;
  courses: IGenericRepository<Course>;
  enrollments: IGenericRepository<Enrollment>;
  users: IGenericRepository<User>;
  roles: IGenericRepository<Role>;
  permissions: IGenericRepository<PermissionEntity>;
  batches: IGenericRepository<Batch>;

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
    @InjectRepository(User)
    private readonly userRepository: IGenericRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: IGenericRepository<Role>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: IGenericRepository<PermissionEntity>,
    @InjectRepository(Batch)
    private readonly batchRepository: IGenericRepository<Batch>,
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

    this.users = new GenericRepository<User>(
      User,
      this.entityManager,
      this.userRepository.queryRunner!,
    );

    this.roles = new GenericRepository<Role>(
      Role,
      this.entityManager,
      this.roleRepository.queryRunner!,
    );

    this.permissions = new GenericRepository<PermissionEntity>(
      PermissionEntity,
      this.entityManager,
      this.permissionRepository.queryRunner!,
    );

    this.batches = new GenericRepository<Batch>(
      Batch,
      this.entityManager,
      this.batchRepository.queryRunner!,
    );
  }
}
