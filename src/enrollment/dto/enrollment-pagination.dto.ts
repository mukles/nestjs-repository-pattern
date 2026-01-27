import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/pagination/pagination.dto';
import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

export class EnrollmentPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by enrollment status', enum: EnrollmentStatus })
  @IsOptional()
  @IsString()
  status?: EnrollmentStatus;

  @ApiPropertyOptional({ description: 'Filter by course ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  courseId?: number;

  @ApiPropertyOptional({ description: 'Filter by batch ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  batchId?: number;

  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  studentId?: number;

  @ApiPropertyOptional({ description: 'Start date for filtering enrollments' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering enrollments' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
