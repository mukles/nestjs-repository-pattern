import { ApiProperty } from "@nestjs/swagger";
import { PermissionDto, RoleDto } from "@repo/shared-types";

export class RoleResponseDto implements RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @ApiProperty({ type: [Object] })
  permissions: PermissionDto[];

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isSystem: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
