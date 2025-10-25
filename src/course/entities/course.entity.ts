import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  code: string;

  @Column({
    type: 'int',
    default: 3,
  })
  credits: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({
    type: 'int',
    nullable: true,
  })
  teacherId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
