import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { EnrollmentEntity } from '../../enrollment/entities/enrollment.entity';
import { ResultType } from '../enum/result-type.enum';

@Entity('results')
@Unique(['enrollment', 'type'])
export class ResultEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ResultType })
  type: ResultType;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  grade: string;

  @Column({ type: 'float' })
  maxScore: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => EnrollmentEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  enrollment: EnrollmentEntity;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
