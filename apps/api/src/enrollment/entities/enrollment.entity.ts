import { ResultEntity } from '../../result/entities/result.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { BatchEntity } from '../../batch/entities/batch.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { EnrollmentStatus } from '../enum/enrolllment-status.enum';
@Unique(['student', 'batch'])
@Entity('enrollments')
export class EnrollmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentEntity, (student) => student.enrollments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: StudentEntity;

  @ManyToOne(() => BatchEntity, (batch) => batch.enrollments, {
    nullable: false,
  })
  @JoinColumn({ name: 'batchId' })
  batch: BatchEntity;

  @OneToMany(() => ResultEntity, (result) => result.enrollment)
  results: ResultEntity[];

  @Column({ type: 'enum', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  suspensionReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
