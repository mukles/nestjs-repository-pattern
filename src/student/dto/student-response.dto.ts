import { ApiProperty } from '@nestjs/swagger';

import { Gender } from '../enum/student.gender.enum';
import { StudentStatus } from '../enum/student.status.enum';

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
