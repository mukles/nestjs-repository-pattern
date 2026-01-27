import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

export class UpdateEnrollmentStatusDto {
  @ApiProperty({ description: 'Status of the enrollment', enum: EnrollmentStatus })
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  status: EnrollmentStatus;
}
