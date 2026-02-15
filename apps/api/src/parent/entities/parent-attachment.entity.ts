import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ParentEntity } from "./parent.entity";

@Entity("parent_attachments")
export class ParentAttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
    type: "varchar",
    length: 100,
  })
  documentType: string;

  @ManyToOne(() => ParentEntity, (parent) => parent.attachments, {
    onDelete: "CASCADE",
  })
  parent: ParentEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;
}
