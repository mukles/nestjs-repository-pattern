import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  credits?: number;

  @IsOptional()
  @IsInt()
  teacherId?: number;
}
