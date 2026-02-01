import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "John" })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;
}
