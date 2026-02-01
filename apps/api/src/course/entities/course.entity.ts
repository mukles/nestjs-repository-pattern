import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { BatchEntity } from "../../batch/entities/batch.entity";
import { TeacherEntity } from "../../teacher/entities/teacher.entity";
import { CourseStatus } from "../enum/course.status.enum";

@Entity("courses")
export class CourseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 200,
  })
  title: string;

  @Column({ type: "varchar", length: 10 })
  code: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: CourseStatus,
  })
  status: CourseStatus;

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  @Column({ type: "varchar", length: 50 })
  duration: string;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.courses, {
    nullable: false,
  })
  teacher: TeacherEntity;

  @OneToMany(() => BatchEntity, (batch) => batch.course)
  batches: BatchEntity[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
