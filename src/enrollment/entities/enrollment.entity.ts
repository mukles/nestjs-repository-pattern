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

import { Batch } from '../../batch/entities/batch.entity';
import { Student } from '../../student/entities/student.entity';
import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

@Entity('enrollments')
export class Enrollment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Batch, (batch) => batch.enrollments, { nullable: false })
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  @Column({ type: 'enum', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
