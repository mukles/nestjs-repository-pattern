import { ApiProperty } from '@nestjs/swagger';

import { Gender, StudentStatus } from '../entities/student.entity';

export class StudentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: StudentStatus })
  status: StudentStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
