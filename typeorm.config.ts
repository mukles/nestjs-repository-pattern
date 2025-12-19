import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Student } from './src/student/entities/student.entity';
import { Teacher } from './src/teacher/entities/teacher.entity';
import { Course } from './src/course/entities/course.entity';
import { Enrollment } from './src/enrollment/entities/enrollment.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Student, Teacher, Course, Enrollment],
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: true,
  synchronize: configService.get<boolean>('SYNCHRONIZE', false),
});
