import { Injectable } from "@nestjs/common";

import {
  DocumentType,
  ParentAttachmentEntity,
  ParentEntity,
  ParentType,
} from "./entities";

@Injectable()
export class ParentService {
  async createParent(data: {
    name: string;
    email?: string;
    phone?: string;
    occupation?: string;
    type: ParentType;
    studentId: number;
  }): Promise<ParentEntity> {
    const parent = ParentEntity.create({
      ...data,
    });
    return parent.save();
  }

  async addAttachment(
    parentId: number,
    data: {
      fileName: string;
      fileUrl: string;
      documentType: DocumentType;
    },
  ): Promise<ParentAttachmentEntity> {
    const attachment = ParentAttachmentEntity.create({
      ...data,
      parentId,
    });
    return attachment.save();
  }

  async findByStudentId(studentId: number): Promise<ParentEntity[]> {
    return ParentEntity.find({
      where: { studentId },
      relations: ["attachments"],
    });
  }

  async findOne(id: number): Promise<ParentEntity | null> {
    return ParentEntity.findOne({
      where: { id },
      relations: ["attachments"],
    });
  }

  async getAttachments(parentId: number): Promise<ParentAttachmentEntity[]> {
    return ParentAttachmentEntity.find({
      where: { parentId },
    });
  }

  async removeAttachment(attachmentId: number): Promise<void> {
    await ParentAttachmentEntity.delete(attachmentId);
  }
}
