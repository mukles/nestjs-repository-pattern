import { ParentType } from "parent/enum/parent-type.enum";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { StudentEntity } from "../../student/entities/student.entity";
import type { ParentAttachmentEntity } from "./parent-attachment.entity";

@Entity("parents")
export class ParentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 100,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  occupation: string;

  @Column({
    type: "enum",
    enum: ParentType,
  })
  type: ParentType;

  @ManyToOne(() => StudentEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: StudentEntity;

  @Column()
  studentId: number;

  @OneToMany(
    "ParentAttachmentEntity",
    (attachment: ParentAttachmentEntity) => attachment.parent,
  )
  attachments: ParentAttachmentEntity[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
