import { Batch } from '../../batch/entities/batch.entity';
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { PermissionEntity } from '../../role/entities/permission.entity';
import { Role } from '../../role/entities/role.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { User } from '../../user/entities/user.entity';
import { IGenericRepository } from './repository.interface';

export abstract class IDataService {
  students: IGenericRepository<Student>;
  teachers: IGenericRepository<Teacher>;
  courses: IGenericRepository<Course>;
  enrollments: IGenericRepository<Enrollment>;
  users: IGenericRepository<User>;
  roles: IGenericRepository<Role>;
  batches: IGenericRepository<Batch>;
  permissions: IGenericRepository<PermissionEntity>;
}
