import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { DataServiceModule } from './repositories/dataservice.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataServiceModule,
    StudentModule,
    TeacherModule,
    EnrollmentModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
