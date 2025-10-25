import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { Student } from './entities/student.entity';
import { provideStudentRepository } from './repositories/student.repository.provider';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UtilsModule],
  controllers: [StudentController],
  providers: [StudentService, ...provideStudentRepository()],
})
export class StudentModule {}
