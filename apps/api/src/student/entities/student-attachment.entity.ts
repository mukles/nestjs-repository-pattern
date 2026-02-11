import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { StudentEntity } from "./student.entity";

export enum StudentDocumentType {
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  TRANSFER_CERTIFICATE = "TRANSFER_CERTIFICATE",
  PREVIOUS_MARKSHEET = "PREVIOUS_MARKSHEET",
  MEDICAL_CERTIFICATE = "MEDICAL_CERTIFICATE",
  OTHER = "OTHER",
}

@Entity("student_attachments")
export class StudentAttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  fileName: string;

  @Column({
    type: "varchar",
    length: 500,
  })
  fileUrl: string;

  @Column({
    type: "enum",
    enum: StudentDocumentType,
  })
  documentType: StudentDocumentType;

  @ManyToOne("StudentEntity", (student: StudentEntity) => student.attachments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "studentId" })
  student: StudentEntity;

  @Column()
  studentId: number;

  @CreateDateColumn({ type: "timestamp" })
  uploadedAt: Date;
}
