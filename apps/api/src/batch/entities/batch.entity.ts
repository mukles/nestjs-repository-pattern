import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { BatchStatus } from '../enum/batch-status.enum';

@Entity('batches')
export class Batch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  maxStudents: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'enum', enum: BatchStatus, default: BatchStatus.DRAFT })
  status: BatchStatus;

  @ManyToOne(() => Course, (course) => course.batches, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.batch)
  enrollments: Enrollment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
