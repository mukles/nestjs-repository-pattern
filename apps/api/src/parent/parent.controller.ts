import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { ParentService } from "./parent.service";

@Controller("parents")
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get("student/:studentId")
  async findByStudentId(@Param("studentId", ParseIntPipe) studentId: number) {
    return this.parentService.findByStudentId(studentId);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.parentService.findOne(id);
  }

  @Get(":id/attachments")
  async getAttachments(@Param("id", ParseIntPipe) id: number) {
    return this.parentService.getAttachments(id);
  }
}
