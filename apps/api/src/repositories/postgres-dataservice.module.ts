import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchEntity } from '../batch/entities/batch.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { EnrollmentEntity } from '../enrollment/entities/enrollment.entity';
import { ResultEntity } from '../result/entities/result.entity';
import { PermissionEntity } from '../role/entities/permission.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { StudentEntity } from '../student/entities/student.entity';
import { TeacherEntity } from '../teacher/entities/teacher.entity';
import { UserEntity } from '../user/entities/user.entity';
import { GenericDataService } from './implementation/dataservice.implementation';
import { IDataService } from './interfaces/dataservice.interface';
import { SessionEntry } from '../session/entities/session.entry';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity,
      TeacherEntity,
      CourseEntity,
      EnrollmentEntity,
      UserEntity,
      RoleEntity,
      PermissionEntity,
      BatchEntity,
      ResultEntity,
      SessionEntry,
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log({ dbUrl: config.get<string>('DATABASE_URL') });
        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          entities: [
            StudentEntity,
            TeacherEntity,
            CourseEntity,
            EnrollmentEntity,
            UserEntity,
            RoleEntity,
            PermissionEntity,
            BatchEntity,
            ResultEntity,
            SessionEntry,
          ],
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
