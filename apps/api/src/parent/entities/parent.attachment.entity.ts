import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("parent_attachments")
export class ParentAttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 500,
  })
  url: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;
}
