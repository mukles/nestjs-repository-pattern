import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { ParentEntity } from "./parent.entity";

export enum DocumentType {
  NID = "NID",
  PASSPORT = "PASSPORT",
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  OCCUPATION_PROOF = "OCCUPATION_PROOF",
  OTHER = "OTHER",
}

@Entity("parent_attachments")
export class ParentAttachmentEntity extends BaseEntity {
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
    enum: DocumentType,
  })
  documentType: DocumentType;

  @ManyToOne("ParentEntity", (parent: ParentEntity) => parent.attachments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent: ParentEntity;

  @Column()
  parentId: number;

  @CreateDateColumn({ type: "timestamp" })
  uploadedAt: Date;
}
