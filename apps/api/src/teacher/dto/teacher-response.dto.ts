import { ApiProperty } from "@nestjs/swagger";

import { TeacherGender } from "../enum/teacher.gender.enum";

export class TeacherResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  gender: TeacherGender;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
