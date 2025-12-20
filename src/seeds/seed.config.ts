import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { PermissionEntity } from '../role/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { User } from '../user/entities/user.entity';

config();

const configService = new ConfigService();

export const SeedDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [User, Role, PermissionEntity, Student, Teacher, Course, Enrollment],
  synchronize: false,
});
