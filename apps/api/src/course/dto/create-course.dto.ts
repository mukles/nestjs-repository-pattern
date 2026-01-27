import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { CourseStatus } from '../enum/course.status.enum';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CourseStatus })
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  duration: string;

  @ApiProperty()
  @IsNotEmpty()
  teacherId: number;
}
