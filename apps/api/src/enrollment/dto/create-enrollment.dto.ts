import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { EnrollmentStatus } from "../enum/enrolllment-status.enum";

export class CreateEnrollmentDto {
  @ApiProperty({ description: "ID of the student enrolling" })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({
    description: "Status of the enrollment",
    enum: EnrollmentStatus,
    required: false,
  })
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;
}
