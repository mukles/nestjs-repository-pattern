import { Module } from '@nestjs/common';

import { RoleModule } from '../role/role.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [RoleModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
