import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
