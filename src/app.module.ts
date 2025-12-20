import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnrollmentModule } from './enrollment/enrollment.module';
import { DataServiceModule } from './repositories/dataservice.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { CourseModule } from './course/course.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ResultModule } from './result/result.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataServiceModule,
    StudentModule,
    TeacherModule,
    EnrollmentModule,
    CourseModule,
    ResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
