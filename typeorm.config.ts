import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { Batch } from './src/batch/entities/batch.entity';
import { Course } from './src/course/entities/course.entity';
import { Enrollment } from './src/enrollment/entities/enrollment.entity';
import { PermissionEntity } from './src/role/entities/permission.entity';
import { Role } from './src/role/entities/role.entity';
import { Student } from './src/student/entities/student.entity';
import { Teacher } from './src/teacher/entities/teacher.entity';
import { User } from './src/user/entities/user.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Student, Teacher, Course, Enrollment, Batch, User, Role, PermissionEntity],
  logging: true,
  migrations: ['src/migrations/*.ts'],
  migrationsRun: true,
  synchronize: configService.get<boolean>('SYNCHRONIZE', false),
});
