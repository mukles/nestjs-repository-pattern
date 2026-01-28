import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { EnrollmentStatus } from '../enum/enrolllment-status.enum';

export class UpdateEnrollmentStatusDto {
  @ApiProperty({
    description: 'Status of the enrollment',
    enum: EnrollmentStatus,
  })
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  status: EnrollmentStatus;

  @ApiProperty({
    description: 'Reason for suspension (required if status is SUSPENDED)',
    required: false,
  })
  @IsString()
  @IsOptional()
  suspensionReason?: string;
}
