import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { BatchModule } from "./batch/batch.module";
import { CourseModule } from "./course/course.module";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { DataServiceModule } from "./repositories/dataservice.module";
import { ResultModule } from "./result/result.module";
import { RoleModule } from "./role/role.module";
import { StudentModule } from "./student/student.module";
import { TeacherModule } from "./teacher/teacher.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataServiceModule,
    AuthModule,
    UserModule,
    RoleModule,
    StudentModule,
    TeacherModule,
    EnrollmentModule,
    CourseModule,
    ResultModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
