import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

import { IGenericRepository } from './repository.interface';

export abstract class IDataService {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;
  courses: IGenericRepository<Course>;
  enrollments: IGenericRepository<Enrollment>;
}
