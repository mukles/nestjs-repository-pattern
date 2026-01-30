import { Module } from "@nestjs/common";

import { RoleModule } from "../role/role.module";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
  imports: [RoleModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
