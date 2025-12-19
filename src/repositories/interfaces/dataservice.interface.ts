import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

import { IGenericRepository } from './repository.interface';

export abstract class IDataService {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;
  courses: IGenericRepository<Course>;
}
