import { Gender, StudentStatus } from "@repo/shared-types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { EnrollmentEntity } from "../../enrollment/entities/enrollment.entity";
import { ParentEntity } from "../../parent/entities/parent.entity";
import type { StudentAttachmentEntity } from "./student-attachment.entity";

@Entity("students")
export class StudentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 100,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: "timestamp",
  })
  dateOfBirth: Date;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.student)
  enrollments: EnrollmentEntity[];

  @OneToMany(() => ParentEntity, (parent) => parent.student)
  parents: ParentEntity[];

  @OneToMany(
    "StudentAttachmentEntity",
    (attachment: StudentAttachmentEntity) => attachment.student,
  )
  attachments: StudentAttachmentEntity[];

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: "enum",
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
