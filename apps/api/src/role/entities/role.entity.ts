import type { Relation } from 'typeorm';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Role as RoleEnum } from '../enums/role.enum';
import { PermissionEntity } from './permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    unique: true,
  })
  name: RoleEnum;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Relation<PermissionEntity[]>;

  @OneToMany(() => User, (user) => user.role)
  users: Relation<User[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
