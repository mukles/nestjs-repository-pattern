import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

import { BatchEntity } from "./src/batch/entities/batch.entity";
import { CourseEntity } from "./src/course/entities/course.entity";
import { EnrollmentEntity } from "./src/enrollment/entities/enrollment.entity";
import { PermissionEntity } from "./src/role/entities/permission.entity";
import { RoleEntity } from "./src/role/entities/role.entity";
import { StudentEntity } from "./src/student/entities/student.entity";
import { TeacherEntity } from "./src/teacher/entities/teacher.entity";
import { UserEntity } from "./src/user/entities/user.entity";

// Load .env from root of monorepo
config({ path: join(__dirname, "../../.env") });

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
  ],
  logging: true,
  migrations: ["src/migrations/*.ts"],
  migrationsRun: true,
  synchronize: configService.get<boolean>("SYNCHRONIZE", false),
});
