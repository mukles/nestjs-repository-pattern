import type { Relation } from "typeorm";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserEntity } from "../../user/entities/user.entity";
import { PermissionEntity } from "./permission.entity";

@Entity("roles")
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    unique: true,
  })
  name: string;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: Relation<PermissionEntity[]>;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: Relation<UserEntity[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
