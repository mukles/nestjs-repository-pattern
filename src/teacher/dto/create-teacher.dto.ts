import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { TeacherGender } from '../enum/teacher.gender.enum';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email: string;

  @IsDateString()
  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;

  @IsEnum(TeacherGender)
  @IsNotEmpty()
  readonly gender: TeacherGender;
}
