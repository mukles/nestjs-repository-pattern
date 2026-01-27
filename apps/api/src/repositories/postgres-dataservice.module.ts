import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Batch } from '../batch/entities/batch.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { PermissionEntity } from '../role/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { User } from '../user/entities/user.entity';
import { GenericDataService } from './implementation/dataservice.implementation';
import { IDataService } from './interfaces/dataservice.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      Course,
      Enrollment,
      User,
      Role,
      PermissionEntity,
      Batch,
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log({ dbUrl: config.get<string>('DATABASE_URL') });
        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          entities: [Student, Teacher, Course, Enrollment, User, Role, PermissionEntity, Batch],
          synchronize: config.get<boolean>('SYNCHRONIZE', false),
          logging: true,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: GenericDataService,
    },
  ],
  exports: [IDataService],
})
export class PostgresDataServiceModule {}
