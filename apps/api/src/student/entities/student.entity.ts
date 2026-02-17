import { Gender, StudentStatus } from "@repo/shared-types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { EnrollmentEntity } from "../../enrollment/entities/enrollment.entity";
import { ParentEntity } from "../../parent/entities/parent.entity";
import { StudentAttachmentEntity } from "./student-attachment.entity";

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

  @Column({ nullable: true })
  photo: string;

  @Column({
    type: "timestamp",
  })
  dateOfBirth: Date;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.student)
  enrollments: EnrollmentEntity[];

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

  @ManyToOne(() => ParentEntity, (parent) => parent.students)
  father: ParentEntity;

  @ManyToOne(() => ParentEntity, (parent) => parent.students)
  mother: ParentEntity;

  @ManyToOne(() => ParentEntity, { nullable: true })
  guardian: ParentEntity;

  @Column({ type: "varchar", length: 50, nullable: true })
  guardianRelation: string;

  @Column({ type: "boolean", default: false })
  isOrphan: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
