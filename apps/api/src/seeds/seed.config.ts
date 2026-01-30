import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource } from "typeorm";

import { CourseEntity } from "../course/entities/course.entity";
import { EnrollmentEntity } from "../enrollment/entities/enrollment.entity";
import { PermissionEntity } from "../role/entities/permission.entity";
import { RoleEntity } from "../role/entities/role.entity";
import { StudentEntity } from "../student/entities/student.entity";
import { TeacherEntity } from "../teacher/entities/teacher.entity";
import { UserEntity } from "../user/entities/user.entity";

config();

const configService = new ConfigService();

export const SeedDataSource = new DataSource({
  type: "postgres",
  url: configService.get<string>("DATABASE_URL"),
  entities: [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    StudentEntity,
    TeacherEntity,
    CourseEntity,
    EnrollmentEntity,
  ],
  synchronize: false,
});
