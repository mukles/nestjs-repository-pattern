import { ApiProperty } from '@nestjs/swagger';

import { BatchStatus } from '../enum/batch-status.enum';

export class BatchResponseDto {
  @ApiProperty({ description: 'Batch ID' })
  id: number;

  @ApiProperty({ description: 'Batch name' })
  name: string;

  @ApiProperty({
    description: 'Start date of the batch',
    type: String,
    format: 'date-time',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the batch',
    type: String,
    format: 'date-time',
  })
  endDate: Date;

  @ApiProperty({ description: 'Maximum number of students (slots)' })
  maxStudents: number;

  @ApiProperty({ description: 'Current enrolled students count' })
  enrolledStudents: number;

  @ApiProperty({ description: 'Batch status', enum: BatchStatus })
  status: BatchStatus;

  @ApiProperty({ description: 'Course ID' })
  courseId: number;

  @ApiProperty({ description: 'Course title' })
  courseTitle: string;

  @ApiProperty({
    description: 'Date when batch was created',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when batch was last updated',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
