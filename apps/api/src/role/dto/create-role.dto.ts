import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}
