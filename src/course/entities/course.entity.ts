import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Batch } from '../../batch/entities/batch.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { CourseStatus } from '../enum/course.status.enum';

@Entity('courses')
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
  })
  status: CourseStatus;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 50 })
  duration: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, { nullable: false })
  teacher: Teacher;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, { nullable: false })
  enrollments: Enrollment[];

  @OneToMany(() => Batch, (batch) => batch.course)
  batches: Batch[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
