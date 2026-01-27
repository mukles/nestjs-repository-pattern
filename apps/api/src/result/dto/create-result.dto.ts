import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ResultType } from '../enum/result-type.enum';

export class CreateResultDto {
  @ApiProperty({
    description: 'Enrollment ID (student enrolled in a batch)',
    example: 12,
  })
  @IsInt()
  @IsPositive()
  enrollmentId: number;

  @ApiProperty({
    enum: ResultType,
    description: 'Type of assessment',
    example: ResultType.FINAL,
  })
  @IsEnum(ResultType)
  type: ResultType;

  @ApiProperty({
    description: 'Obtained score',
    example: 78,
  })
  @IsNumber()
  @Min(0)
  score: number;

  @ApiProperty({
    description: 'Maximum possible score',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  maxScore: number;

  @ApiProperty({
    description: 'Grade (optional)',
    example: 'A-',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  grade?: string;

  @ApiProperty({
    description: 'Teacher remarks (optional)',
    example: 'Good performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
