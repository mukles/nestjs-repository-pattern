import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { StudentEntity } from "./student.entity";

@Entity("student_attachments")
export class StudentAttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  birthCertificate: string;

  @Column("simple-array", { nullable: true })
  previousCertificates: string[];

  @OneToOne(() => StudentEntity, (student) => student.attachment)
  @JoinColumn()
  student: StudentEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
