import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/pagination/pagination.dto';
import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

export class EnrollmentPaginationDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: EnrollmentStatus;
}
