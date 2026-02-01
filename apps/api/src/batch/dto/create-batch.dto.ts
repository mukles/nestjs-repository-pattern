import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

import { BatchStatus } from "../enum/batch-status.enum";

export class CreateBatchDto {
  @ApiProperty({ description: "Batch name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Start date of the batch",
    type: String,
    format: "date-time",
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: "End date of the batch",
    type: String,
    format: "date-time",
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: "Maximum number of students (slots)" })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  maxStudents: number;

  @ApiProperty({
    description: "Batch status",
    enum: BatchStatus,
    default: BatchStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;
}
