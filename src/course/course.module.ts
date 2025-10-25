import { Module } from '@nestjs/common';
import { DataServiceModule } from 'src/repositories/dataservice.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [DataServiceModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
