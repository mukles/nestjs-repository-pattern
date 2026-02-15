import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

import { BatchEntity } from "./src/batch/entities/batch.entity";
import { CourseEntity } from "./src/course/entities/course.entity";
import { EnrollmentEntity } from "./src/enrollment/entities/enrollment.entity";
import { ParentAttachmentEntity } from "./src/parent/entities/parent.attachment.entity";
import { ParentEntity } from "./src/parent/entities/parent.entity";
import { ResultEntity } from "./src/result/entities/result.entity";
import { PermissionEntity } from "./src/role/entities/permission.entity";
import { RoleEntity } from "./src/role/entities/role.entity";
import { SessionEntry } from "./src/session/entities/session.entry";
import { StudentAttachmentEntity } from "./src/student/entities/student.attachment.entity";
import { StudentEntity } from "./src/student/entities/student.entity";
import { TeacherEntity } from "./src/teacher/entities/teacher.entity";
import { UserEntity } from "./src/user/entities/user.entity";

config({ path: join(__dirname, "../../apps/api/.env") });

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: configService.get<string>("DATABASE_URL"),
  entities: [
    StudentEntity,
    TeacherEntity,
    CourseEntity,
    EnrollmentEntity,
    BatchEntity,
    UserEntity,
    RoleEntity,
    PermissionEntity,
    ResultEntity,
    SessionEntry,
    ParentEntity,
    ParentAttachmentEntity,
    StudentAttachmentEntity,
  ],
  logging: true,
  migrations: ["src/migrations/*.ts"],
  migrationsRun: true,
  synchronize:
    configService.get<string>("SYNCHRONIZE") !== "true" ? false : true,
});
