import { ApiProperty } from '@nestjs/swagger';

import { ResultType } from '../enum/result-type.enum';

class StudentInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class BatchInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class CourseInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class ResultResponseDto {
  @ApiProperty({ description: 'Result ID' })
  id: number;

  @ApiProperty({ enum: ResultType })
  type: ResultType;

  @ApiProperty({ description: 'Obtained score' })
  score: number;

  @ApiProperty({ description: 'Maximum possible score' })
  maxScore: number;

  @ApiProperty({ description: 'Calculated percentage' })
  percentage: number;

  @ApiProperty({ description: 'Grade (A, B+, C, etc)', nullable: true })
  grade?: string;

  @ApiProperty({ description: 'Teacher remarks', nullable: true })
  remarks?: string;

  @ApiProperty({ type: StudentInfoDto })
  student: StudentInfoDto;

  @ApiProperty({ type: BatchInfoDto })
  batch: BatchInfoDto;

  @ApiProperty({ type: CourseInfoDto })
  course: CourseInfoDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
