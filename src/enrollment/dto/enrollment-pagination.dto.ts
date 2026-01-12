import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/pagination/pagination.dto';
import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

export class EnrollmentPaginationDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: EnrollmentStatus;

  @ApiPropertyOptional({ description: 'Start date for filtering enrollments' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering enrollments' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
