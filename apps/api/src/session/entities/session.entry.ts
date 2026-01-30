import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({
    type: "timestamp",
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;
}
