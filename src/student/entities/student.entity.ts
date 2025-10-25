import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('students')
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({
    type: 'timestamp',
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'others'],
  })
  gender: 'male' | 'female' | 'others';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
