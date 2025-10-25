import { IsDate, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsDate()
  dateOfBirth: Date;
}
