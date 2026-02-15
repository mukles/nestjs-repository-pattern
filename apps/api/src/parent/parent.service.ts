import { Injectable, NotFoundException } from "@nestjs/common";
import { ParentType } from "@repo/shared-types";

import { IDataService } from "../repositories/interfaces/dataservice.interface";
import { ParentAttachmentEntity, ParentEntity } from "./entities";

@Injectable()
export class ParentService {
  constructor(private readonly dataService: IDataService) {}

  async createParent(data: {
    name: string;
    email?: string;
    phone?: string;
    occupation?: string;
    type: ParentType;
    studentId: number;
  }): Promise<ParentEntity> {
    const parent = this.dataService.parents.create({
      ...data,
    });
    return this.dataService.parents.save(parent);
  }

  async addAttachment(
    parentId: number,
    data: {
      fileName: string;
      fileUrl: string;
      documentType: string;
    },
  ): Promise<ParentAttachmentEntity> {
    const parent = await this.dataService.parents.findOne({
      where: { id: parentId },
    });
    if (!parent) throw new NotFoundException("Parent not found");
    const attachment = this.dataService.parentAttachments.create({
      ...data,
      parent,
    });
    return this.dataService.parentAttachments.save(attachment);
  }

  async findByStudentId(studentId: number): Promise<ParentEntity[]> {
    return this.dataService.parents.find({
      where: { students: { id: studentId } },
      relations: ["attachments", "students"],
    });
  }

  async findOne(id: number): Promise<ParentEntity | null> {
    return this.dataService.parents.findOne({
      where: { id },
      relations: ["attachments"],
    });
  }

  async getAttachments(parentId: number): Promise<ParentAttachmentEntity[]> {
    return this.dataService.parentAttachments.find({
      where: { parent: { id: parentId } },
      relations: ["parent"],
    });
  }

  async removeAttachment(attachmentId: number): Promise<void> {
    await this.dataService.parentAttachments.delete(attachmentId);
  }
}
