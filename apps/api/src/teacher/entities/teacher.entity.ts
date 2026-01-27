import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CourseEntity } from '../../course/entities/course.entity';
import { TeacherGender } from '../enum/teacher.gender.enum';

@Entity('teachers')
export class TeacherEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
    unique: true,
  })
  email: string;

  @Column({
    type: 'timestamp',
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 100,
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: TeacherGender,
  })
  gender: TeacherGender;

  @OneToMany(() => CourseEntity, (course) => course.teacher)
  courses: CourseEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
