import { Module } from '@nestjs/common';

import { DataServiceModule } from 'src/repositories/dataservice.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [DataServiceModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
