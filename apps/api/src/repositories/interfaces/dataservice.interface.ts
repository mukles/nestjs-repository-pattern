import { SessionEntry } from '../../session/entities/session.entry';
import { BatchEntity } from '../../batch/entities/batch.entity';
import { CourseEntity } from '../../course/entities/course.entity';
import { EnrollmentEntity } from '../../enrollment/entities/enrollment.entity';
import { ResultEntity } from '../../result/entities/result.entity';
import { PermissionEntity } from '../../role/entities/permission.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { TeacherEntity } from '../../teacher/entities/teacher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IGenericRepository } from './repository.interface';

export abstract class IDataService {
  students: IGenericRepository<StudentEntity>;
  teachers: IGenericRepository<TeacherEntity>;
  courses: IGenericRepository<CourseEntity>;
  enrollments: IGenericRepository<EnrollmentEntity>;
  users: IGenericRepository<UserEntity>;
  roles: IGenericRepository<RoleEntity>;
  batches: IGenericRepository<BatchEntity>;
  permissions: IGenericRepository<PermissionEntity>;
  results: IGenericRepository<ResultEntity>;
  sessions: IGenericRepository<SessionEntry>;
}
