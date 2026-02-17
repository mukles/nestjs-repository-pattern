import { ApiProperty } from "@nestjs/swagger";
import { Gender, StudentStatus } from "@repo/shared-types";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";

export class CreateStudentDto implements CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ type: String, format: "date-time" })
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: StudentStatus, required: false })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  photo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  fatherId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  motherId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  guardianId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  guardianRelation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isOrphan?: boolean;
}
