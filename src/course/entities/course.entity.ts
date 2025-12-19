import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
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

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 50 })
  duration: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, { nullable: false })
  teacher: Teacher;

  @OneToMany(() => Enrollment, (enrollment) => enrollment, { nullable: false })
  enrollments: Enrollment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
