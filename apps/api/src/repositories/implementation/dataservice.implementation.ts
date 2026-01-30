import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { BatchEntity } from "../../batch/entities/batch.entity";
import { CourseEntity } from "../../course/entities/course.entity";
import { EnrollmentEntity } from "../../enrollment/entities/enrollment.entity";
import { ResultEntity } from "../../result/entities/result.entity";
import { PermissionEntity } from "../../role/entities/permission.entity";
import { RoleEntity } from "../../role/entities/role.entity";
import { StudentEntity } from "../../student/entities/student.entity";
import { TeacherEntity } from "../../teacher/entities/teacher.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { IDataService } from "../interfaces/dataservice.interface";
import { IGenericRepository } from "../interfaces/repository.interface";
import { GenericRepository } from "./repository.implementation";

@Injectable()
export class GenericDataService
  implements IDataService, OnApplicationBootstrap
{
  students: IGenericRepository<StudentEntity>;
  teachers: IGenericRepository<TeacherEntity>;
  courses: IGenericRepository<CourseEntity>;
  enrollments: IGenericRepository<EnrollmentEntity>;
  users: IGenericRepository<UserEntity>;
  roles: IGenericRepository<RoleEntity>;
  permissions: IGenericRepository<PermissionEntity>;
  batches: IGenericRepository<BatchEntity>;
  results: IGenericRepository<ResultEntity>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: IGenericRepository<StudentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: IGenericRepository<TeacherEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: IGenericRepository<CourseEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepository: IGenericRepository<EnrollmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: IGenericRepository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: IGenericRepository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: IGenericRepository<PermissionEntity>,
    @InjectRepository(BatchEntity)
    private readonly batchRepository: IGenericRepository<BatchEntity>,
  ) {}

  onApplicationBootstrap() {
    this.teachers = new GenericRepository<TeacherEntity>(
      TeacherEntity,
      this.entityManager,
      this.teacherRepository.queryRunner!,
    );

    this.students = new GenericRepository<StudentEntity>(
      StudentEntity,
      this.entityManager,
      this.studentRepository.queryRunner!,
    );

    this.courses = new GenericRepository<CourseEntity>(
      CourseEntity,
      this.entityManager,
      this.courseRepository.queryRunner!,
    );

    this.enrollments = new GenericRepository<EnrollmentEntity>(
      EnrollmentEntity,
      this.entityManager,
      this.enrollmentRepository.queryRunner!,
    );

    this.users = new GenericRepository<UserEntity>(
      UserEntity,
      this.entityManager,
      this.userRepository.queryRunner!,
    );

    this.roles = new GenericRepository<RoleEntity>(
      RoleEntity,
      this.entityManager,
      this.roleRepository.queryRunner!,
    );

    this.permissions = new GenericRepository<PermissionEntity>(
      PermissionEntity,
      this.entityManager,
      this.permissionRepository.queryRunner!,
    );

    this.batches = new GenericRepository<BatchEntity>(
      BatchEntity,
      this.entityManager,
      this.batchRepository.queryRunner!,
    );

    this.results = new GenericRepository<ResultEntity>(
      ResultEntity,
      this.entityManager,
      this.batchRepository.queryRunner!,
    );
  }
}
