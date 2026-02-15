import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { StudentEntity } from "../../student/entities/student.entity";
import { ParentAttachmentEntity } from "./parent-attachment.entity";

@Entity("parents")
export class ParentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  relationship: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  nid: string;

  @OneToMany(() => StudentEntity, (student) => student.father)
  students: StudentEntity[];

  @OneToMany(() => ParentAttachmentEntity, (attachment) => attachment.parent)
  attachments: ParentAttachmentEntity[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
