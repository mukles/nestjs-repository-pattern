import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SuspendEnrollmentDto {
  @ApiProperty({
    description: 'Reason for suspending the enrollment',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Suspension reason must be at least 10 characters long',
  })
  reason: string;
}
