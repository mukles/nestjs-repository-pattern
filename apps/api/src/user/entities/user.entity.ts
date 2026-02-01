import * as bcrypt from "bcrypt";
import type { Relation } from "typeorm";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { RoleEntity } from "../../role/entities/role.entity";
import { UserStatus } from "../enums/user-status.enum";

@Entity("users")
export class UserEntity extends BaseEntity {
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
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: "text",
    nullable: true,
  })
  banReason?: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  roles: Relation<RoleEntity[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt: string = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
