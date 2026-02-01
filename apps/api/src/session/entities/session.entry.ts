import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserEntity } from "../../user/entities/user.entity";

@Entity("sessions")
export class SessionEntry extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  sessionId: string;

  @Column()
  refreshToken: string;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;
}
